import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { CreateCashflowDto, UpdateCashflowDto } from './dto';

import { Cashflow } from './cashflow.entity';
import { CashflowRepository } from './cashflow.repository';
import { KassaService } from '../kassa/kassa.service';
import { CashFlowEnum } from '../../infra/shared/enum';
import { DataSource, EntityManager } from 'typeorm';

Injectable();
export class CashflowService {
  constructor(
    @InjectRepository(Cashflow)
    private readonly cashflowRepository: CashflowRepository,
    private readonly kassaService: KassaService,
    private readonly connection: DataSource,
  ) {}

  async getAll(options: IPaginationOptions): Promise<Pagination<Cashflow>> {
    return paginate<Cashflow>(this.cashflowRepository, options);
  }

  async getOne(id: string) {
    const data = await this.cashflowRepository.findOne({
      where: { id },
    });

    if (!data) {
      throw new HttpException('data not found', HttpStatus.NOT_FOUND);
    }
    return data;
  }

  async deleteOne(id: string) {
    const cashflow = await this.cashflowRepository.findOne({where:{id},relations:{kassa:true}})
    const kassa = await this.kassaService.getById(cashflow.kassa.id);
    if (cashflow.type == CashFlowEnum.InCome) {
      kassa.totalSum -= cashflow.price;
    }
    if (cashflow.type == CashFlowEnum.Consumption) {
      kassa.expenditure -= cashflow.price;
    }
    await this.connection.transaction(async (manager: EntityManager) => {
      await manager.save(kassa);
    });
    const response = await this.cashflowRepository.delete(id);
    return response;
  }

  async change(value: UpdateCashflowDto, id: string) {
    if(value.price){
      const cashflow = await this.cashflowRepository.findOne({ where: { id } });
      const kassa = await this.kassaService.getById(value.kassa);
      if (value.type == CashFlowEnum.InCome) {
        if (cashflow.type == CashFlowEnum.InCome) {
          kassa.totalSum -= cashflow.price;
          kassa.totalSum += value.price;
        } else {
          kassa.expenditure -= cashflow.price;
          kassa.totalSum += value.price;
        }
      }
      if (value.type == CashFlowEnum.Consumption) {
        if (cashflow.type == CashFlowEnum.Consumption) {
          kassa.expenditure -= cashflow.price;
          kassa.expenditure += value.price;
        } else {
          kassa.totalSum -= cashflow.price;
          kassa.expenditure += value.price;
        }
      }
      await this.connection.transaction(async (manager: EntityManager) => {
        await manager.save(kassa);
      });
    }
    const response = await this.cashflowRepository
      .createQueryBuilder()
      .update()
      .set(value as unknown as Cashflow)
      .where('id = :id', { id })
      .execute();
    return response;
  }

  async create(value: CreateCashflowDto, id: string) {
    const data = { ...value, casher: id };
    const response = this.cashflowRepository
      .createQueryBuilder()
      .insert()
      .into(Cashflow)
      .values(data as unknown as Cashflow)
      .returning('id')
      .execute();

    const kassa = await this.kassaService.getById(value.kassa);
    if (value.type == CashFlowEnum.InCome) {
      kassa.totalSum += value.price;
    }
    if (value.type == CashFlowEnum.Consumption) {
      kassa.expenditure += value.price;
    }
    await this.connection.transaction(async (manager: EntityManager) => {
      await manager.save(kassa);
    });

    return response;
  }
}
