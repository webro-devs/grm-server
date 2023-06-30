import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { FindOptionsWhere } from 'typeorm';

import { Kassa } from './kassa.entity';
import { KassaRepository } from './kassa.repository';
import { CreateKassaDto, UpdateKassaDto } from './dto';
import { CashFlowEnum } from '../../infra/shared/enum';
import { FilialService } from '../filial/filial.service';

Injectable();
export class KassaService {
  constructor(
    @InjectRepository(Kassa)
    private readonly kassaRepository: KassaRepository,
    private readonly filialService: FilialService,
  ) {}

  async getAll(
    options: IPaginationOptions,
    where?: FindOptionsWhere<Kassa>,
  ): Promise<Pagination<Kassa>> {
    return paginate<Kassa>(this.kassaRepository, options, {
      relations: { orders: true, cashflow: true },
    });
  }

  async getById(id: string) {
    const data = await this.kassaRepository.findOne({ where: { id } });
    if (!data) {
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    }
    return data;
  }
  async getOne(id: string) {
    const data = await this.kassaRepository.findOne({
      where: { id },
    });

    if (!data) {
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    }

    return data;
  }

  async GetOpenKassa(id: string) {
    const data = await this.kassaRepository.findOne({
      where: { isActive: true, filial: { id } },
    });

    if (!data) {
      return false;
    }

    return data;
  }

  async closeKassa(id: string) {
    const response = await this.kassaRepository.update(id, {
      isActive: false,
      endDate: new Date(),
    });
    return response;
  }

  async deleteOne(id: string) {
    const response = await this.kassaRepository.delete(id);
    return response;
  }

  async change(value: UpdateKassaDto, id: string) {
    const response = await this.kassaRepository
      .createQueryBuilder()
      .update()
      .set(value as unknown as Kassa)
      .where('id = :id', { id })
      .execute();
    return response;
  }

  async create(value: CreateKassaDto) {
    const check = await this.GetOpenKassa(value.filial);
    if (check) {
      return false;
    }

    const data = this.kassaRepository
      .createQueryBuilder()
      .insert()
      .into(Kassa)
      .values(value as unknown as Kassa)
      .returning('id')
      .execute();
    return data;
  }

  async getKassaSum(id: string) {
    const data = await this.kassaRepository.findOne({
      where: { id },
    });
    const comingSum = +data.totalSum;
    const goingSum = +data.expenditure;
    const sellingSize = +data.totalSize;
    return { comingSum, goingSum, sellingSize };
  }

  async kassaSumByFilialAndRange(where) {
    const data = await this.kassaRepository.find({
      where,
    });

    if (data.length) {
      const comingSum = data.map((d) => +d.totalSum).reduce((a, b) => a + b);
      const goingSum = data.map((d) => +d.expenditure).reduce((a, b) => a + b);
      const sellingSize = data.map((d) => +d.totalSize).reduce((a, b) => a + b);
      const additionalProfitTotalSum = data
        .map((d) => +d.additionalProfitTotalSum)
        .reduce((a, b) => a + b);
      return { comingSum, goingSum, sellingSize, additionalProfitTotalSum };
    } else {
      return { comingSum: 0, goingSum: 0, sellingSize: 0 };
    }
  }

  async kassaSumAllFilialByRange(where) {
    const result = [];
    const filialData = await this.filialService.getAllFilial();
    for (const filial of filialData) {
      where.filial = {
        id: filial.id,
      };
      const { comingSum, goingSum, sellingSize } =
        await this.kassaSumByFilialAndRange(where);
      result.push({ ...filial, comingSum, goingSum, sellingSize });
    }
    return result;
  }
}
