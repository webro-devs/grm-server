import { Inject, Injectable, forwardRef } from '@nestjs/common';
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
    @Inject(forwardRef(() => KassaService))
    private readonly kassaService: KassaService,
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

    if (where?.total) {
      total = true;
      delete where.total;
    }

    for await (let filial of allFilial) {
      if (!where?.filial?.id) {
        where.filial = {
          id: filial.id,
        };
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
      } = await this.kassaService.kassaTotal({
        filial: { id: where.filial.id },
        ...(where?.isActive && { isActive: true }),
      });

      const { remainingSize, remainingSum } = await this.productService.remainingProducts({
        filial: { id: where.filial.id },
      });

      result.push({
        name: filial.title,
        remainingSize,
        remainingSum,
        sellingSize,
        total: cashFlowSumBoss + cashFlowSumShop + plasticSum,
        kassaSum: comingSum - additionalProfitTotalSum - cashFlowSumShop,
        sellingSum: comingSum,
        plasticSum,
        goingSumShop,
        goingSumBoss,
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

  async getRemainingProducts() {
    const data = await this.productService.getRemainingProductsForAllFilial();
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
    const order = this.entityManager
      .getRepository('order')
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.casher', 'casher')
      .leftJoinAndSelect('order.seller', 'seller')
      .leftJoinAndSelect('order.kassa', 'kassa')
      .leftJoinAndSelect('order.product', 'product')
      .leftJoinAndSelect('product.color', 'color')
      .leftJoinAndSelect('product.model', 'model')
      .leftJoinAndSelect('model.collection', 'collection')
      .leftJoin('kassa.filial', 'filial')
      .where('order.isActive != :progres', { progres: 'progress' });

    const cashflow = this.entityManager
      .getRepository('cashflow')
      .createQueryBuilder('cashflow')
      .leftJoinAndSelect('cashflow.casher', 'casher')
      .leftJoinAndSelect('cashflow.kassa', 'kassa')
      .leftJoin('kassa.filial', 'filial');

    if (where.type === 'income') {
      order.where('LOWER(order.isActive) LIKE LOWER(:progres)', { progres: '%ccep%' });
      cashflow.where('LOWER(cashflow.type) LIKE LOWER(:progres)', { progres: '%их%' });
    }

    if (where.type === 'expense') {
      order.where('LOWER(order.isActive) LIKE LOWER(:type)', { type: '%ejec%' });
      cashflow.where('LOWER(cashflow.type) LIKE LOWER(:type)', { type: '%сх%' });
    }

    if (where.filial) {
      order.andWhere('filial.id = :filial', { filial: where.filial });
      cashflow.andWhere('filial.id = :filial', { filial: where.filial });
    }

    const orders = await order.getManyAndCount();
    const cashflows = await cashflow.getManyAndCount();

    const items = paginateArray([...orders[0], ...cashflows[0]], where.page, where.limit);
    const result = {
      //@ts-ignore
      items: items.sort((b, a) => new Date(a.date) - new Date(b.date)),
      meta: {
        totalItems: orders[1] + cashflows[1],
        itemCount: items.length,
        itemsPerPage: where?.limit,
        totalPages: Math.ceil((orders[1] + cashflows[1]) / where.limit),
        currentPage: where.page,
      },
    };

    return result;
  }
}
