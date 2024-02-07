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
import { Between, DataSource, EntityManager, Equal, FindOptionsWhere, Repository } from 'typeorm';

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
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';

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

  async getAll(
    options: IPaginationOptions,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    where?: FindOptionsWhere<Order>,
  ): Promise<Pagination<Order>> {
    return paginate<Order>(this.orderRepository, options, {
      relations: {
        seller: true,
        product: { model: { collection: true }, color: true },
      },
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
        ...(collcetion && { product: { model: { collection: { id: Equal(collcetion) } } } }),
      },
    });

    user.sellerOrders = data || [];
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

    if (value.isMetric) {
      if (product.x < value.x) throw new BadRequestException('Not enough product meter!');
      product.x = product.x - value.x;
      product.setTotalSize();
      product.calculateProductPrice();
      additionalProfitSum = value.price - product.priceMeter * value.x * product.y;
      netProfitSum = (product.priceMeter - product.comingPrice) * value.x * product.y;
    } else {
      if (product.count < value.x) throw new BadRequestException('Not enough product count!');
      product.count = +product.count - +value.x;
      product.setTotalSize();
      additionalProfitSum = value.price - product.price;
      netProfitSum = (product.priceMeter - product.comingPrice) * product.x * product.y;
    }
    product.isMetric = value.isMetric;
    await this.saveRepo(product);

    const data = { ...value, seller: id, additionalProfitSum, netProfitSum };
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
      relations: { kassa: true, product: true },
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

    return response;
  }

  async rejectOrder(id: string) {
    const data = await this.orderRepository.findOne({
      where: { id },
      relations: { product: true },
    });
    const product = data.product;

    if (product.isMetric) {
      product.x += data.x;
      product.calculateProductPrice();
      product.setTotalSize();
    } else {
      product.count += 1;
      product.setTotalSize();
    }

    await this.saveRepo(product);

    return await this.orderRepository.update({ id }, { isActive: OrderEnum.Reject });
  }

  async returnOrder(id: string, userId: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: {
        product: {
          filial: true,
          color: true,
        },
        kassa: true,
      },
    });

    await this.returnProduct(order.product, 1, order.x);

    await this.addCashFlow(
      order.price - order.additionalProfitSum,
      order.kassa.id,
      CashflowExpenditureEnum.BOSS,
      CashFlowEnum.Consumption,
      userId,
    );

    await this.addCashFlow(
      order.additionalProfitSum,
      order.kassa.id,
      CashflowExpenditureEnum.SHOP,
      CashFlowEnum.Consumption,
      userId,
    );
  }

  async addCashFlow(price: number, kassa: string, title: string, type: CashFlowEnum, id: string) {
    await this.cashFlowService.create({ price, comment: 'Возврат товара', casher: '', kassa, title, type }, id);
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
}
