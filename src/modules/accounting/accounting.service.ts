import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { KassaService } from '../kassa/kassa.service';
import { FilialService } from '../filial/filial.service';
import { ProductService } from '../product/product.service';
import { CollectionService } from '../collection/collection.service';
import { ClientOrderService } from '../client-order/client-order.service';
import { paginateArray } from 'src/infra/helpers';
import { EntityManager } from 'typeorm';
import { OrderCashflowDto } from './dto';

Injectable();
export class AccountingService {
  constructor(
    private readonly kassaService: KassaService,
    @Inject(forwardRef(()=> FilialService))
    private readonly filialService: FilialService,
    private readonly productService: ProductService,
    private readonly collectionService: CollectionService,
    private readonly clientOrderService: ClientOrderService,
    private readonly entityManager: EntityManager,
  ) {}

  async getFullAccounting(where) {
    const result = [];
    const allFilial = await this.filialService.getAllFilial();
    let total = false;
    const haveFilial = where?.filial?.id || false;
    console.log(where);
    if (where?.total) {
      total = true;
    }
     where.total && delete where.total;

    for await (let filial of allFilial) {
      if (!where?.filial?.id) {
        where.filial = {
          id: filial.id,
        };
      } else {
        filial = allFilial.find(e => e.id === where.filial.id);
      }

      const {
        comingSum,
        goingSumBoss,
        goingSumShop,
        sellingSize,
        additionalProfitTotalSum,
        cashFlowSumBoss,
        cashFlowSumShop,
        plasticSum,
        netProfitTotalSum,
      } = await this.kassaService.kassaTotal({
        filial: { id: where.filial.id },
        isActive: total ? true : false,
        ...(where?.startDate && { startDate: where.startDate }),
      });

      const { remainingSize, remainingSum } = await this.productService.remainingProducts({
        filial: { id: where.filial.id },
        ...(where.date && { date: where.date }),
      });

      result.push({
        name: filial.name || filial.title,
        remainingSize,
        remainingSum,
        sellingSize,
        total: comingSum - (goingSumBoss + goingSumShop),
        kassaSum: comingSum - additionalProfitTotalSum,
        sellingSum: comingSum  - (goingSumBoss + goingSumShop),
        plasticSum,
        goingSumShop,
        goingSumBoss,
        cashFlowSumBoss,
        additionalProfitTotalSum,
        netProfitTotalSum,
      });
      delete where.filial.id;

      if (haveFilial) break;
    }

    if (total) {
      const total = result.reduce(
        (acc, curr) => {
          Object.keys(curr).forEach((key) => {
            if (key !== 'name') {
              acc[key] = (acc[key] || 0) + curr[key];
            }
          });
          return acc;
        },
        { name: 'total' },
      );
      return total;
    }

    return result;
  }

  async getRemainingProducts(query) {
    const data = await this.productService.getRemainingProductsForAllFilial(query);
    const remainingSize = data.map((p) => p.remainingSize).reduce((a, b) => a + b);
    const remainingSum = data.map((p) => p.remainingSum).reduce((a, b) => a + b);
    return { remainingSize, remainingSum };
  }

  async getRemainingProductsByCollection(query) {
    const data = await this.collectionService.remainingProductsByCollection(query);
    return data;
  }

  async getKassaSumForAllFilialByRange(where) {
    const data = await this.kassaService.kassaSumAllFilialByRange(where);
    return data;
  }

  async getInternetShopSum(where) {
    const data = await this.clientOrderService.getInternetShopSumByRange(where);
    return data;
  }

  async getTotal() {
    const data = { terminal: 50000, summ: 100000 };
    return data;
  }

  async getKassaActions(where: OrderCashflowDto) {
    const query = { endDate: where?.endDate, startDate: where?.startDate };
    if (!query.endDate) {
      let tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(23, 59, 59, 999);
      query.endDate = tomorrow;
    }
    if (!query.startDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      query.startDate = today;
    }
    let from = new Date(query.startDate);
    let to = new Date(query.endDate);

    from.setHours(0, 0, 0, 1);
    to.setHours(23, 59, 59, 999);

    const orderQuery = this.entityManager
      .getRepository('order')
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.casher', 'casher')
      .leftJoinAndSelect('order.seller', 'seller')
      .leftJoinAndSelect('order.kassa', 'kassa')
      .leftJoinAndSelect('order.product', 'product')
      .leftJoinAndSelect('product.color', 'color')
      .leftJoinAndSelect('product.model', 'model')
      .leftJoinAndSelect('model.collection', 'collection')
      .leftJoin('order.filial', 'filial')
      .where('order.isActive != :progress', { progress: 'progress' });

    const cashflowQuery = this.entityManager
      .getRepository('cashflow')
      .createQueryBuilder('cashflow')
      .leftJoinAndSelect('cashflow.casher', 'casher')
      .leftJoinAndSelect('cashflow.kassa', 'kassa')
      .leftJoin('cashflow.filial', 'filial');

    if (where.type === 'income') {
      orderQuery.andWhere('LOWER(order.isActive) LIKE LOWER(:progress)', { progress: '%ccep%' });
      cashflowQuery.andWhere('LOWER(cashflow.type) LIKE LOWER(:progress)', { progress: '%их%' });
    }

    if (where.type === 'expense') {
      orderQuery.andWhere('LOWER(order.isActive) LIKE LOWER(:type)', { type: '%ejec%' });
      cashflowQuery.andWhere('LOWER(cashflow.type) LIKE LOWER(:type)', { type: '%сх%' });
    }

    if (where.filial) {
      orderQuery.andWhere('filial.id = :filial', { filial: where.filial });
      cashflowQuery.andWhere('filial.id = :filial', { filial: where.filial });
    }

    if (where.endDate && where.startDate) {
      orderQuery.andWhere('order.date BETWEEN :startDate AND :endDate', { startDate: from, endDate: to });
      cashflowQuery.andWhere('cashflow.date BETWEEN :startDate AND :endDate', { startDate: from, endDate: to });
    } else if (where.startDate) {
      orderQuery.andWhere('order.date >= :startDate', { startDate: from });
      cashflowQuery.andWhere('cashflow.date >= :startDate', { startDate: from });
    } else if (where.endDate) {
      orderQuery.andWhere('order.date <= :endDate', { endDate: to });
      cashflowQuery.andWhere('cashflow.date <= :endDate', { endDate: to });
    }

    const [orders, ordersCount] = await orderQuery.getManyAndCount();
    const [cashflows, cashflowsCount] = await cashflowQuery.getManyAndCount();

    const allItems = [...orders, ...cashflows];
    const sortedItems = allItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const items = paginateArray(sortedItems, where.page, where.limit);

    const result = {
      items,
      meta: {
        totalItems: ordersCount + cashflowsCount,
        itemCount: items.length,
        itemsPerPage: where?.limit,
        totalPages: Math.ceil((ordersCount + cashflowsCount) / where.limit),
        currentPage: where.page,
      },
    };

    return result;
  }
}
