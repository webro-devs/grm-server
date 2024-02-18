import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { KassaService } from '../kassa/kassa.service';
import { FilialService } from '../filial/filial.service';
import { ProductService } from '../product/product.service';
import { CollectionService } from '../collection/collection.service';
import { ClientOrderService } from '../client-order/client-order.service';

Injectable();
export class AccountingService {
  constructor(
    @Inject(forwardRef(() => KassaService))
    private readonly kassaService: KassaService,
    private readonly filialService: FilialService,
    private readonly productService: ProductService,
    private readonly collectionService: CollectionService,
    private readonly clientOrderService: ClientOrderService,
  ) {}

  async getFullAccounting(where) {
    const result = [];
    const allFilial = await this.filialService.getAllFilial();
    let total = false;
    if (where?.total) {
      total = true;
      delete where.total;
    }

    for (let filial of allFilial) {
      !where?.filial?.id &&
        (where.filial = {
          id: filial.id,
        });

      const {
        comingSum,
        goingSumBoss,
        goingSumShop,
        sellingSize,
        additionalProfitTotalSum,
        cashFlowSumBoss,
        cashFlowSumShop,
        plasticSum,
      } = await this.kassaService.kassaSumByFilialAndRange(where);
      const { remainingSize, remainingSum } = await this.productService.remainingProducts({
        filial: { id: filial.id },
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
    }

    if (total) {
      return result.reduce(
        (prev, el) => {
          return { total: prev.total + el.total, plastic: prev.plastic + el.plasticSum };
        },
        { total: 0, plastic: 0 },
      );
    }

    return result;
  }

  async getRemainingProducts() {
    const data = await this.productService.getRemainingProductsForAllFilial();
    const remainingSize = data.map((p) => p.remainingSize).reduce((a, b) => a + b);
    const remainingSum = data.map((p) => p.remainingSum).reduce((a, b) => a + b);
    return { remainingSize, remainingSum };
  }

  async getRemainingProductsByCollection() {
    const data = await this.collectionService.remainingProductsByCollection();
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
}
