import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { KassaService } from '../kassa/kassa.service';
import { FilialService } from '../filial/filial.service';
import { ProductService } from '../product/product.service';
import { CollectionService } from '../collection/collection.service';

Injectable();
export class AccountingService {
  constructor(
    @Inject(forwardRef(() => KassaService))
    private readonly kassaService: KassaService,
    private readonly filialService: FilialService,
    private readonly productService: ProductService,
    private readonly collectionService: CollectionService,
  ) {}

  async getFullAccounting(where) {
    const result = [];
    const allFilial = await this.filialService.getAllFilial();

    for (let filial of allFilial) {
      where.filial = {
        id: filial.id,
      };
      const { comingSum, goingSum, sellingSize, additionalProfitTotalSum } =
        await this.kassaService.kassaSumByFilialAndRange(where);
      const { remainingSize, remainingSum } =
        await this.productService.remainingProducts({
          filial: { id: filial.id },
        });

      result.push({
        name: filial.title,
        remainingSize,
        remainingSum,
        sellingSize,
        kassaSum: 0,
        sellingSum: comingSum,
        goingSum,
        profit: 0,
      });
    }
    return result;
  }

  async getRemainingProducts() {
    const data = await this.productService.getRemainingProductsForAllFilial();
    return data;
  }

  async getRemainingProductsByCollection() {
    const data = await this.collectionService.remainingProductsByCollection();
    return data;
  }

  async getKassaSumForAllFilialByRange(where) {
    const data = await this.kassaService.kassaSumAllFilialByRange(where);
    return data;
  }
}
