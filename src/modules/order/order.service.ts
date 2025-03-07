import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import {
  Between,
  DataSource,
  EntityManager,
  Equal,
  FindOptionsWhere,
  InsertResult,
  LessThan,
  MoreThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';

import { Order } from './order.entity';
import { CreateOrderDto, UpdateOrderDto } from './dto';
import { CreateProductDto } from '../product/dto';
import { ProductService } from '../product/product.service';
import { KassaService } from '../kassa/kassa.service';
import { ActionService } from '../action/action.service';
import { CashFlowEnum, OrderEnum } from 'src/infra/shared/enum';
import { CashflowService } from '../cashflow/cashflow.service';
import { Product } from '../product/product.entity';
import { GRMGateway } from '../web-socket/web-socket.gateway';
import { FilialService } from '../filial/filial.service';
import { OrderBasketService } from '../order-basket/order-basket.service';
import { User } from '../user/user.entity';
import { calcProdProfit } from './utils/functions';
import { TransferService } from '../transfer/transfer.service';
//
Injectable();
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @Inject(forwardRef(() => GRMGateway))
    private readonly grmGetaway: GRMGateway,
    private readonly productService: ProductService,
    @Inject(forwardRef(()=> KassaService))
    private readonly kassaService: KassaService,
    private readonly actionService: ActionService,
    private readonly cashFlowService: CashflowService,
    private readonly connection: DataSource,
    private readonly entityManager: EntityManager,
    private readonly filialService: FilialService,
    private readonly orderBasketService: OrderBasketService,
    private readonly transferService: TransferService,
  ) {}

  async getAll(options: IPaginationOptions, where?: FindOptionsWhere<Product>): Promise<Pagination<Order>> {
    return paginate<Order>(this.orderRepository, options, {
      relations: {
        seller: true,
        product: { model: { collection: true }, color: true, filial: true },
        kassa: true,
      },
      where,
      order: { date: 'DESC' },
    });
  }

  async getById(id: string) {
    const data = await this.orderRepository
      .findOne({
        where: { id },
        relations: {
          casher: true, seller: true, product: {
            model: { collection: true }, color: true,
          }, kassa: true,
        },
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
      console.log(product);
      throw new HttpException('Not enough product', HttpStatus.BAD_REQUEST);
    }
    const user = await this.entityManager
      .getRepository('users')
      .findOne({ where: { id: id }, relations: { filial: true } })
      .catch(() => {
        throw new BadRequestException('User Not Found!');
      });

    let filial = user?.filial?.id;
    if(user.role > 3 && user.role !== 4){
      filial = product.filial.id
    }
    let kassa: any = await this.kassaService.GetOpenKassa(filial);
    if (!kassa) {
      kassa = { id: (await this.kassaService.create({ filial })).raw[0].id };
    }

    if(filial != product.filial.id){
      throw new BadRequestException('You cannot sell a product on a non-working branch!')
    }

    if (value.isMetric) {
      if (product.y < value.x / 100) throw new BadRequestException('Not enough product meter!');
      const cost = value.x / 100;
      product.y = product.y - cost;
      product.setTotalSize();
      product.calculateProductPrice();
      additionalProfitSum = ((value.price + (value?.plasticSum || 0)) - product.priceMeter * (cost * product.x));
      netProfitSum = (product.priceMeter - product.comingPrice) * cost * product.x;
      value.kv = cost;
    } else {
      if (product.count < value.x) throw new BadRequestException('Not enough product count!');
      product.count = +product.count - +value.x;
      product.setTotalSize();
      additionalProfitSum = (value.price + (value?.plasticSum || 0)) - product.price;
      netProfitSum = (product.priceMeter - product.comingPrice) * product.x * product.y;
      value.kv = product.x * product.y * value.x;
    }

    product.isMetric = value.isMetric;
    await this.saveRepo(product);

    const data = { ...value, seller: id, additionalProfitSum, netProfitSum, kassa: value.kassa || kassa.id };
    return await this.orderRepository
      .createQueryBuilder()
      .insert()
      .into(Order)
      .values(data as unknown as Order)
      .returning('id')
      .execute();
  }

  async createWithBasket(price: number, plasticSum: number, user: User): Promise<InsertResult> {
    const orderBaskets = calcProdProfit(await this.orderBasketService.findAll(user), price + plasticSum, plasticSum);

    for await (const basket of orderBaskets) {
      const product = await this.productService.getOne(basket.product);
      if (basket.isMetric) {
        if (product.y < basket.x / 100) throw new BadRequestException('Not enough product meter!');
      } else {
        if (product.count < basket.x) throw new BadRequestException('Not enough product count!');
      }
    }

    if (!orderBaskets.length) throw new BadRequestException('For selling need product!');
    if (!user.filial) throw new BadRequestException('For selling you should be seller or you need filial!');
    const kassa = await this.kassaService.GetOpenKassa(user.filial.id);

    const orders = [];

    for await (let value of orderBaskets) {
      let additionalProfitSum: number, netProfitSum: number;
      const product = await this.productService.getOne(value.product);

      if (value.isMetric) {
        const cost = value.x / 100;
        product.y = product.y - cost;
        product.setTotalSize();
        product.calculateProductPrice();
        additionalProfitSum = ((+value.price + (+value?.plasticSum || 0)) - +product.priceMeter * (cost * product.x));
        netProfitSum = (product.priceMeter - product.comingPrice) * cost * product.x;
        value.kv = cost * product.x;
      } else {
        product.count = +product.count - +value.x;
        product.setTotalSize();
        additionalProfitSum = (+value.price + (+value?.plasticSum || 0)) - +product.price;
        netProfitSum = (product.priceMeter - product.comingPrice) * product.x * product.y;
        value.kv = product.x * product.y * value.x;
      }

      product.isMetric = value.isMetric;
      await this.saveRepo(product);

      orders.push({ ...value, seller: user.id, additionalProfitSum, netProfitSum, kassa: kassa.id });
    }

    await this.orderRepository.save(orders, { chunk: Math.floor(orders.length / 20) });

    await this.orderBasketService.bulkDelete(user.id);

    return { generatedMaps: [], identifiers: [], raw: [1] };
  }

  async checkOrder(id: string, casher: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: { kassa: { filial: true }, product: { model: { collection: true }, color: true }, seller: true, casher: true },
    });

    const kassa = await this.kassaService.getById(order.kassa.id);

    kassa.totalSum = kassa.totalSum + Number(order.price) || 0;

    if (order.product.isMetric) {
      kassa.totalSize = kassa.totalSize + (order.x / 100) * order.product.x;
    } else {
      kassa.totalSize = kassa.totalSize + order.product.x * order.product.y;
    }

    kassa.netProfitTotalSum = kassa.netProfitTotalSum + order.netProfitSum;

    kassa.additionalProfitTotalSum = kassa.additionalProfitTotalSum + order.additionalProfitSum;

    kassa.plasticSum = kassa.plasticSum + order.plasticSum;

    await this.entityManager.save(kassa);

    const response = await this.orderRepository
      .createQueryBuilder()
      .update()
      .set({ isActive: OrderEnum.Accept, casher } as unknown as Order)
      .where('id = :id', { id })
      .execute();

    const action = await this.actionService.create({ ...order, isActive: OrderEnum.Accept }, casher, order.kassa.filial.id, 'accept_order');

    await this.grmGetaway.Action(action.raw[0]?.id);
    await this.grmGetaway.sendBossOrder(order);
    return response;
  }

  async rejectOrder(id: string, casher) {
    const data = await this.orderRepository.findOne({
      where: { id },
      relations: { product: true, kassa: { filial: true } },
    });
    if (data.isActive === OrderEnum.Reject) throw new BadRequestException('Already Rejected');
    const product = data.product;

    if (product.isMetric) {
      product.y = (Math.abs(+data.x) / 100) + Math.abs(product.y);
      product.calculateProductPrice();
      product.setTotalSize();
    } else {
      product.count += data.x;
      product.setTotalSize();
    }

    const action = await this.actionService.create({ ...data, isActive: OrderEnum.Reject }, casher, data.kassa.filial.id, 'reject_order');
    await this.saveRepo(product);

    await this.grmGetaway.Action(action.raw[0].id);
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

    if (order.isActive === OrderEnum.Reject) throw new BadRequestException('Already Returned!');
    await this.returnProduct(order.product, order.x, order.x);
    const kassa = await this.kassaService.GetOpenKassa(order.product.filial.id);

    await this.addCashFlow(
      order.price + order.plasticSum,
      kassa.id,
      'Возврат',
      CashFlowEnum.Consumption,
      userId,
      `${order?.product?.model?.collection['title']} | ${order?.product?.model?.title} | ${order.product.size} | 
      ${'x' + order.x} | ${order.product.shape}`,
    );

    if (order.product.isMetric) {
      await this.entityManager.query(`update kassa set "totalSize" = '${order.kassa.totalSize - ( order.x / 100 ) * order.product.x}' where id = '${order.kassa.id}'`);
    } else {
      await this.entityManager.query(`update kassa set "totalSize" = '${order.kassa.totalSize - order.product.x * order.product.y}' where id = '${order.kassa.id}'`);
    }

    await this.orderRepository.update({ id: order.id }, { isActive: OrderEnum.Reject });
    const action = await this.actionService.create(
      { ...order, isActive: OrderEnum.Reject },
      userId,
      order.product.filial.id,
      'return_order',
    );

    await this.grmGetaway.Action(action.raw[0].id);
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
    if (query.filial) {
      result
        .leftJoin('o.product', 'product')
        .leftJoin('product.filial', 'filial')
        .andWhere('filial.id = :id', { id: query.filial });
    }

    return await result.getRawMany();
  }

  async correctOrdersKassa(id: string) {
    const kassa = await this.kassaService.getKassaAndOrders(id);

    if (kassa?.orders) {
      for await (let kassaOrder of kassa.orders) {
        if (kassaOrder.product.isMetric) {
          const cost = kassaOrder.x / 100;
          kassaOrder.additionalProfitSum = (kassaOrder.price - kassaOrder.product.priceMeter * cost);
          kassaOrder.netProfitSum = (kassaOrder.product.priceMeter - kassaOrder.product.comingPrice) * cost * kassaOrder.product.x;
          kassaOrder.kv = cost * kassaOrder.product.x;
        } else {
          kassaOrder.additionalProfitSum = kassaOrder.price - kassaOrder.product.price;
          kassaOrder.netProfitSum = (kassaOrder.product.priceMeter - kassaOrder.product.comingPrice) * kassaOrder.product.x * kassaOrder.product.y;
          kassaOrder.kv = kassaOrder.product.x * kassaOrder.product.y;
        }
        await this.entityManager.save(kassaOrder);
      }
      kassa.totalSize = 0;
      kassa.totalSum = 0;
      kassa.additionalProfitTotalSum = 0;
      kassa.netProfitTotalSum = 0;
      kassa.plasticSum = 0;
      await this.entityManager.save(kassa);
    }

    return 'okay';
  }

  async kassaPriceUpdate(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id, isActive: 'accept' },
      relations: {
        kassa: { filial: true },
        product: { model: { collection: true }, color: true },
        seller: true,
        casher: true,
      },
    });
    if (!order) return;

    const kassa = await this.kassaService.getById(order.kassa.id);

    kassa.totalSum = kassa.totalSum + order.price;

    if (order.product.isMetric) {
      kassa.totalSize = kassa.totalSize + (order.x / 100) * order.product.x;
    } else {
      kassa.totalSize = kassa.totalSize + order.product.x * order.product.y;
    }

    kassa.netProfitTotalSum = kassa.netProfitTotalSum + order.netProfitSum;

    kassa.additionalProfitTotalSum = kassa.additionalProfitTotalSum + order.additionalProfitSum;

    kassa.plasticSum = kassa.plasticSum + order.plasticSum;

    await this.entityManager.save(kassa);

    return 'ok';
  }

  async cashflowAdd(id) {
    const kassa = await this.kassaService.getById(id);
    kassa.totalSum = kassa.cashFlowSumBoss + kassa.totalSum;
    kassa.totalSum = kassa.cashFlowSumShop + kassa.totalSum;
    kassa.totalSum = kassa.internetShopSum + kassa.totalSum;
    await this.entityManager.save(kassa);
  }

  async updateFilialKassas() {
    const filials = await this.filialService.getFilialWithKassa();
    for await (const filial of filials) {
      if (filial.kassa) {
        for await(const kassa of filial.kassa) {
          await this.correctOrdersKassa(kassa.id);
        }
        for await (const kassa of filial.kassa) {
          await this.cashflowAdd(kassa.id);
        }
        for await (const kassa of filial.kassa) {
          if (kassa.orders) {
            for await (const order of kassa.orders) {
              await this.kassaPriceUpdate(order.id);
            }
          }
        }
      }
    }
  }
  async acceptInternetShopOrder(value: CreateOrderDto, cashier: User, transferId: string) {
    // @ts-ignore
    value?.['product'] = await this.transferService.checkTransferManager(transferId, cashier.id);
    const order = await this.create(value, cashier.id);
    await this.checkOrder(order.raw[0].id, cashier.id);
    return 'Ok'
  }

  async getDiscount(where) {
    const orders = await this.orderRepository.find({
      where: {
        ...where,
        additionalProfitSum: LessThan(0),
        isActive: Equal('accept')
      },
    });

    return orders.reduce((acc, curr) => acc + curr.additionalProfitSum, 0);
  }

  async getAdditionalTotalProfitSumm(where) {
    const orders = await this.orderRepository.find({
      where: {
        ...where,
        additionalProfitSum: MoreThan(0),
        isActive: Equal('accept')
      },
    });

    return orders.reduce((acc, curr) => acc + curr.additionalProfitSum, 0);
  }

  async getProfitSums(where) {
    function flattenWhereConditions(where, parentKey = '') {
      const result = {};
      for (const key in where) {
        const newKey = parentKey ? `${parentKey}.${key}` : key;
        if (typeof where[key] === 'object' && where[key] !== null) {
          Object.assign(result, flattenWhereConditions(where[key], newKey));
        } else {
          result[newKey] = where[key];
        }
      }
      return result;
    }

    const queryBuilder = this.orderRepository.createQueryBuilder("order")
    .leftJoin("order.product", "product")
    .leftJoin("order.kassa", "kassa")
    .leftJoin("product.filial", "filial")
    .select("SUM(CASE WHEN order.additionalProfitSum < 0 THEN order.additionalProfitSum ELSE 0 END)", "discountSum")
    .addSelect("SUM(CASE WHEN order.additionalProfitSum > 0 THEN order.additionalProfitSum ELSE 0 END)", "additionalProfitTotalSum")
    .addSelect("SUM(product.comingPrice * order.kv)", "comingSum")
    .addSelect("SUM(product.priceMeter * order.kv)", "additionalSum")
    .where(where);

  // Add other conditions from the `where` parameter
  // for (const key in where) {
  //   if (key === 'filial' && where[key].id) {
  //     queryBuilder.andWhere("filial.id = :filialId", { filialId: where[key].id });
  //   } else {
  //     // Flattening nested where conditions for other properties
  //     const flatWhere = flattenWhereConditions(where);
  //     for (const flatKey in flatWhere) {
  //       queryBuilder.andWhere(`${flatKey} = :${flatKey}`, { [flatKey]: flatWhere[flatKey] });
  //     }
  //   }
  // }

  const result = await queryBuilder.getRawOne();

    return {
      discountSum: parseFloat(result.discountSum) || 0,
      additionalProfitTotalSum: parseFloat(result.additionalProfitTotalSum) || 0,
      comingSumBase: parseFloat(result.comingSum) || 0,
      additionalSum: parseFloat(result['additionalSum']) || 0,
    };
  }


  async getCountOrdersShop(where) {
    const count = await this.orderRepository.count({
      where,
    });

    const countAll = await this.orderRepository.count();

    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const countWeek = await this.orderRepository.count({
      where: {
        ...where,
        date: MoreThanOrEqual(lastWeek),
      },
    });

    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const countMonth = await this.orderRepository.count({
      where: {
        ...where,
        date: MoreThanOrEqual(lastMonth),
      },
    });

    return {
      all: { count, percentage: count / (countAll / 100) },
      week: { count: countWeek, percentage: countWeek / (countAll / 100) },
      month: { count: countMonth, percentage: countMonth / (countAll / 100) },
    };
  }
}
