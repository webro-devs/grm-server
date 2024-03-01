import {
  HttpException,
  HttpStatus,
  NotFoundException,
  Injectable,
  Inject,
  forwardRef,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import {
  Between,
  DataSource,
  EntityManager,
  Equal,
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';

import { Order } from './order.entity';
import { UpdateOrderDto, CreateOrderDto } from './dto';
import { CreateProductDto, UpdateProductDto } from '../product/dto';
import { ProductService } from '../product/product.service';
import { KassaService } from '../kassa/kassa.service';
import { ActionService } from '../action/action.service';
import { CashFlowEnum, CashflowExpenditureEnum, OrderEnum } from 'src/infra/shared/enum';
import { CashflowService } from '../cashflow/cashflow.service';
import { Product } from '../product/product.entity';
import { GRMGateway } from '../web-socket/web-socket.gateway';

Injectable();
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @Inject(forwardRef(() => GRMGateway))
    private readonly grmGetaway: GRMGateway,
    private readonly productService: ProductService,
    private readonly kassaService: KassaService,
    private readonly actionService: ActionService,
    private readonly cashFlowService: CashflowService,
    private readonly connection: DataSource,
    private readonly entityManager: EntityManager,
  ) {}

  async getAll(options: IPaginationOptions, where?: FindOptionsWhere<Product>): Promise<Pagination<Order>> {
    return paginate<Order>(this.orderRepository, options, {
      relations: {
        seller: true,
        product: { model: { collection: true }, color: true, filial: true },
      },
      where,
      order: { date: 'DESC' },
    });
  }

  async getById(id: string) {
    const data = await this.orderRepository
      .findOne({
        where: { id },
        relations: { casher: true, seller: true, product: true, kassa: true },
      })
      .catch(() => {
        throw new NotFoundException('data not found');
      });
    return data;
  }

  async getByUser(userId, from?, to?, collcetion?, index?: number) {
    const user = await this.entityManager
      .getRepository('users')
      .findOne({ where: { id: userId }, relations: { filial: true, position: true } })
      .catch(() => {
        throw new BadRequestException('User Not Found!');
      });

    const data = await this.orderRepository.find({
      relations: {
        seller: true,
        product: { model: { collection: true }, color: true },
      },
      where: {
        seller: { id: userId },
        ...(from && { date: Between(from, to) }),
      },
      order: { date: 'DESC' },
    });

    user.sellerOrders = data || [];
    user.sellerOrdersCount = user?.sellerOrders?.length || 0;
    user.index = index;
    return user;
  }

  async getByKassa(id: string) {
    const data = await this.orderRepository
      .find({
        relations: { kassa: true, casher: true, seller: true, product: true },
        where: { kassa: { id } },
        order: { date: 'desc' },
      })
      .catch(() => {
        throw new NotFoundException('data not found');
      });
    return data;
  }

  async getByKassaWithCach(id: string) {
    const data = await this.orderRepository
      .find({
        relations: { kassa: true, casher: true, seller: true, product: true },
        where: { kassa: { id } },
        order: { date: 'desc' },
      })
      .catch(() => {
        throw new NotFoundException('data not found');
      });
    const dataCashflow = await this.cashFlowService.getByKassa(id);

    return [data, dataCashflow];
  }

  async deleteOne(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: { kassa: true, product: true },
    });
    if (order.isActive) {
      const kassa = await this.kassaService.getById(order.kassa.id);
      kassa.totalSum = kassa.totalSum - order.price;

      if (order.x) {
        kassa.totalSize = kassa.totalSize - order.x * order.product.y;
      } else {
        kassa.totalSize = kassa.totalSize - order.product.x * order.product.y;
      }

      kassa.plasticSum = kassa.plasticSum - order.plasticSum;

      kassa.additionalProfitTotalSum = kassa.additionalProfitTotalSum - order.additionalProfitSum;
      kassa.netProfitTotalSum = kassa.netProfitTotalSum - order.netProfitSum;
      await this.saveRepo(kassa);
    }

    const product = order.product;
    if (product.isMetric) {
      product.x += order.x;
      product.calculateProductPrice();
      product.setTotalSize();
    } else {
      product.count += 1;
      product.setTotalSize();
    }

    await this.saveRepo(product);

    const response = await this.orderRepository.delete(id).catch(() => {
      throw new NotFoundException('data not found');
    });
    return response;
  }

  async change(value: UpdateOrderDto, id: string) {
    if (value.price) {
      const order = await this.orderRepository.findOne({
        where: { id },
        relations: { kassa: true, product: true },
      });
      const kassa = await this.kassaService.getById(order.kassa.id);

      if (order.product.isMetric) {
        if (value.x) {
          value.additionalProfitSum = value.price - order.product.priceMeter * value.x * order.product.y;
        }
      } else {
        value.additionalProfitSum = value.price - order.product.price;
      }

      if (order.isActive) {
        kassa.totalSum = kassa.totalSum - order.price;
        kassa.totalSum = kassa.totalSum + value.price;

        kassa.additionalProfitTotalSum = kassa.additionalProfitTotalSum - order.additionalProfitSum;
        kassa.additionalProfitTotalSum = kassa.additionalProfitTotalSum + value.additionalProfitSum;

        if (value.plasticSum) {
          kassa.plasticSum = kassa.plasticSum - order.plasticSum;
          kassa.plasticSum = kassa.plasticSum + value.plasticSum;
        }

        await this.saveRepo(kassa);
      }
    }
    const response = await this.orderRepository
      .createQueryBuilder()
      .update()
      .set(value as unknown as Order)
      .where('id = :id', { id })
      .execute();
    return response;
  }

  async create(value: CreateOrderDto, id: string) {
    const product = await this.productService.getOne(value.product);
    let additionalProfitSum, netProfitSum;
    if (product.count < 1) {
      throw new HttpException('Not enough product', HttpStatus.BAD_REQUEST);
    }

    const user = await this.entityManager
      .getRepository('users')
      .findOne({ where: { id: id }, relations: { filial: true } })
      .catch(() => {
        throw new BadRequestException('User Not Found!');
      });

    const filial = user.filial.id;
    const kassa = await this.kassaService.GetOpenKassa(filial);

    if (value.isMetric) {
      if (product.y < value.x) throw new BadRequestException('Not enough product meter!');
      const cost = value.x / 100;
      product.y = product.y - cost;
      product.setTotalSize();
      product.calculateProductPrice();
      additionalProfitSum = value.price - product.priceMeter * cost * product.y;
      netProfitSum = (product.priceMeter - product.comingPrice) * cost * product.y;
      value.kv = cost;
    } else {
      if (product.count < value.x) throw new BadRequestException('Not enough product count!');
      product.count = +product.count - +value.x;
      product.setTotalSize();
      additionalProfitSum = value.price - product.price;
      netProfitSum = (product.priceMeter - product.comingPrice) * product.x * product.y;
      value.kv = product.x * product.y * value.x;
    }

    product.isMetric = value.isMetric;
    await this.saveRepo(product);

    const data = { ...value, seller: id, additionalProfitSum, netProfitSum, kassa: value.kassa || kassa.id };
    const response = await this.orderRepository
      .createQueryBuilder()
      .insert()
      .into(Order)
      .values(data as unknown as Order)
      .returning('id')
      .execute();

    await this.grmGetaway.orderProduct({ orderId: response.raw[0].id, filialId: product.filial.id });
    return response;
  }

  async checkOrder(id: string, casher: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: { kassa: { filial: true }, product: true },
    });

    const kassa = await this.kassaService.getById(order.kassa.id);

    kassa.totalSum = kassa.totalSum + order.price;

    if (order.product.isMetric) {
      kassa.totalSize = kassa.totalSize + order.x * order.product.y;
    } else {
      kassa.totalSize = kassa.totalSize + order.product.x * order.product.y;
    }

    kassa.netProfitTotalSum = kassa.netProfitTotalSum + order.netProfitSum;

    kassa.additionalProfitTotalSum = kassa.additionalProfitTotalSum + order.additionalProfitSum;

    kassa.plasticSum = kassa.plasticSum + order.plasticSum;

    await this.saveRepo(kassa);

    const response = await this.orderRepository
      .createQueryBuilder()
      .update()
      .set({ isActive: OrderEnum.Accept, casher } as unknown as Order)
      .where('id = :id', { id })
      .execute();

    await this.actionService.create({ ...order, isActive: OrderEnum.Accept }, casher, order.kassa.filial.id, 'accept_order');
    return response;
  }

  async rejectOrder(id: string) {
    const data = await this.orderRepository.findOne({
      where: { id },
      relations: { product: true },
    });
    if (data.isActive === OrderEnum.Reject) throw new BadRequestException('Already Rejected');
    const product = data.product;

    if (product.isMetric) {
      product.x += data.x;
      product.calculateProductPrice();
      product.setTotalSize();
    } else {
      product.count += data.x;
      product.setTotalSize();
    }

    await this.saveRepo(product);

    return await this.orderRepository.delete({ id });
  }

  async returnOrder(id: string, userId: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: {
        product: {
          filial: true,
          color: true,
          model: {
            collection: true,
          },
          partiya: true,
        },
        kassa: true,
      },
    });

    if (order.isActive === OrderEnum.Reject) throw new BadRequestException('Already Rejected!');
    await this.returnProduct(order.product, order.x, order.x);
    const kassa = await this.kassaService.GetOpenKassa(order.product.filial.id);

    await this.addCashFlow(
      order.price + order.plasticSum,
      kassa.id,
      'Возврат',
      CashFlowEnum.Consumption,
      userId,
      `${order?.product?.model?.collection['title']} | ${order?.product?.model?.title} | ${order.product.size} | ${
        order.product.isMetric ? 'x' + order.x * 100 : order.x
      } | ${order.product.shape}`,
    );

    await this.orderRepository.update({ id: order.id }, { isActive: OrderEnum.Reject });
    await this.actionService.create(
      { ...order, isActive: OrderEnum.Reject },
      userId,
      order.product.filial.id,
      'return_order',
    );

    return 'ok';
  }

  async addCashFlow(price: number, kassa: string, title: string, type: CashFlowEnum, id: string, comment?) {
    await this.cashFlowService.create({ price, comment: comment || 'Возврат товара', casher: '', kassa, title, type }, id);
  }

  async returnProduct(product: Product, count: number, x?: number) {
    if (product.isMetric) {
      await this.createCopyProduct(product, x);
    } else {
      product.count += count;
      await this.connection.transaction(async (manager: EntityManager) => {
        await manager.save(product);
      });
    }
  }

  async saveRepo(data: any) {
    await this.connection.transaction(async (manager: EntityManager) => {
      await manager.save(data);
    });
  }

  async createCopyProduct(product: Product, x: number) {
    const newProduct: CreateProductDto = {
      code: product.code,
      color: product.color.id,
      count: 1,
      date: product.date,
      filial: product.filial.id,
      imgUrl: product.imgUrl,
      model: product.model.id,
      price: product.priceMeter * product.y * x,
      comingPrice: product.comingPrice,
      priceMeter: product.priceMeter,
      shape: product.shape,
      size: product.size,
      style: product.style,
      otherImgs: product.otherImgs,
      totalSize: x * product.y,
      x,
      y: product.y,
      partiya: product.partiya.id || null,
      secondPrice: product.secondPrice,
      country: product.country,
    };

    await this.productService.create([newProduct]);
  }

  async getStats(query) {
    let result = this.entityManager
      .createQueryBuilder('Order', 'o')
      .select("DATE_TRUNC('day', o.date)", 'day')
      .addSelect('SUM(o.kv)', 'kv')
      .addSelect('SUM(o.price)', 'price')
      .groupBy('day, o.date')
      .orderBy('o.date', 'DESC');

    if (query.startDate && query.endDate) {
      result.where('o.date >= :fromDate AND o.date <= :toDate', { fromDate: query.startDate, toDate: query.endDate });
    } else if (query.startDate) {
      result.where('o.date >= :fromDate', { fromDate: query.startDate });
    } else if (query.endDate) {
      result.where('o.date <= :toDate', { toDate: query.endDate });
    }

    return await result.getRawMany();
  }
}
