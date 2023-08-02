import {
  HttpException,
  HttpStatus,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import {
  DataSource,
  EntityManager,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { Order } from './order.entity';
import { UpdateOrderDto, CreateOrderDto } from './dto';
import { UpdateProductDto } from '../product/dto';
import { ProductService } from '../product/product.service';
import { KassaService } from '../kassa/kassa.service';
import { ActionService } from '../action/action.service';
import {
  CashFlowEnum,
  CashflowExpenditureEnum,
  OrderEnum,
} from 'src/infra/shared/enum';
import { CashflowService } from '../cashflow/cashflow.service';
import { Product } from '../product/product.entity';

Injectable();
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly productService: ProductService,
    private readonly kassaService: KassaService,
    private readonly actionService: ActionService,
    private readonly cashFlowService: CashflowService,
    private readonly connection: DataSource,
  ) {}

  async getAll(
    options: IPaginationOptions,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    where?: FindOptionsWhere<Order>,
  ): Promise<Pagination<Order>> {
    return paginate<Order>(this.orderRepository, options);
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

  async deleteOne(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: { kassa: true, product: true },
    });
    if (order.isActive) {
      const kassa = await this.kassaService.getById(order.kassa.id);
      kassa.totalSum = +kassa.totalSum - order.price;
      kassa.totalSize =
        +kassa.totalSize - order.count * (+order.product.x * +order.product.y);

      kassa.plasticSum = +kassa.plasticSum - order.plasticSum;

      kassa.additionalProfitTotalSum =
        +kassa.additionalProfitTotalSum - order.additionalProfitSum;
      kassa.netProfitTotalSum = +kassa.netProfitTotalSum - order.netProfitSum;
      await this.saveRepo(kassa);
    }

    const product = order.product;
    product.count += order.count;
    product.setTotalSize();
    await this.saveRepo(product);

    const response = await this.orderRepository.delete(id).catch(() => {
      throw new NotFoundException('data not found');
    });
    return response;
  }

  async change(value: UpdateOrderDto, id: string) {
    if (value.price || value.count) {
      const order = await this.orderRepository.findOne({
        where: { id },
        relations: { kassa: true, product: true },
      });
      const kassa = await this.kassaService.getById(order.kassa.id);

      const product = order.product;
      const diff = order.count - value.count;
      product.count += diff;
      product.setTotalSize();
      await this.saveRepo(product);

      value.netProfitSum =
        value.count * (+product.price - +product.comingPrice);

      value.additionalProfitSum = value.price - +product.price * value.count;

      if (order.isActive) {
        kassa.totalSum = +kassa.totalSum - order.price;
        kassa.totalSum = +kassa.totalSum + value.price;

        kassa.totalSize =
          +kassa.totalSize - order.count * (+product.x * +product.y);
        kassa.totalSize =
          +kassa.totalSize + value.count * (+product.x * +product.y);

        kassa.netProfitTotalSum = +kassa.netProfitTotalSum - order.netProfitSum;
        kassa.netProfitTotalSum = +kassa.netProfitTotalSum + value.netProfitSum;

        kassa.additionalProfitTotalSum =
          +kassa.additionalProfitTotalSum - order.additionalProfitSum;
        kassa.additionalProfitTotalSum =
          +kassa.additionalProfitTotalSum + value.additionalProfitSum;

        if (value.plasticSum) {
          kassa.plasticSum = +kassa.plasticSum - order.plasticSum;
          kassa.plasticSum = +kassa.plasticSum + value.plasticSum;
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
    if (product.count < value.count) {
      throw new HttpException('Not enough product', HttpStatus.BAD_REQUEST);
    }
    product.count = +product.count - value.count;
    product.setTotalSize();
    await this.saveRepo(product);

    const additionalProfitSum = value.price - +product.price * value.count;
    const netProfitSum = value.count * (product.price - product.comingPrice);

    const data = { ...value, seller: id, additionalProfitSum, netProfitSum };
    const response = this.orderRepository
      .createQueryBuilder()
      .insert()
      .into(Order)
      .values(data as unknown as Order)
      .returning('id')
      .execute();
    return response;
  }

  async checkOrder(id: string, casher: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: { kassa: true, product: true },
    });

    const kassa = await this.kassaService.getById(order.kassa.id);

    kassa.totalSum = +kassa.totalSum + +order.price;

    kassa.totalSize =
      +kassa.totalSize + order.count * (+order.product.x * +order.product.y);

    kassa.netProfitTotalSum = +kassa.netProfitTotalSum + +order.netProfitSum;

    kassa.additionalProfitTotalSum =
      +kassa.additionalProfitTotalSum + +order.additionalProfitSum;

    kassa.plasticSum = +kassa.plasticSum + +order.plasticSum;

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

    await this.productService.change(
      { count: data.product.count + data.count } as UpdateProductDto,
      data.product.id,
    );

    return await this.orderRepository.update(
      { id },
      { isActive: OrderEnum.Reject },
    );
  }

  async returnOrder(id: string, userId: string) {
    const order = await this.getById(id);
    await this.returnProduct(order.product, order.count);

    await this.addCashFlow(
      order.price - order.additionalProfitSum,
      order.kassa.id,
      CashflowExpenditureEnum.BOSS,
      CashFlowEnum.Consumption,
      userId
    )

    await this.addCashFlow(
      order.additionalProfitSum,
      order.kassa.id,
      CashflowExpenditureEnum.SHOP,
      CashFlowEnum.Consumption,
      userId
    )
  }

  async addCashFlow(
    price: number,
    kassa: string,
    title: string,
    type: CashFlowEnum,
    id: string,
  ) {
    await this.cashFlowService.create(
      { price, comment: 'Возврат товара', casher: '', kassa, title, type },
      id,
    );
  }

  async returnProduct(product: Product, count: number) {
    product.count += count;
    await this.connection.transaction(async (manager: EntityManager) => {
      await manager.save(product);
    });
  }

  async saveRepo(data: any) {
    await this.connection.transaction(async (manager: EntityManager) => {
      await manager.save(data);
    });
  }
}
