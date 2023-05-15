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

Injectable();
export class KassaService {
  constructor(
    @InjectRepository(Kassa)
    private readonly kassaRepository: KassaRepository,
  ) {}

  async getAll(
    options: IPaginationOptions,
    where?: FindOptionsWhere<Kassa>,
  ): Promise<Pagination<Kassa>> {
    return paginate<Kassa>(this.kassaRepository, options);
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
      return {};
    }

    return data;
  }

  async closeKassa(id: string) {
    const response = await this.kassaRepository.update(id, { isActive: false });
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
    const data = this.kassaRepository
      .createQueryBuilder()
      .insert()
      .into(Kassa)
      .values(value as unknown as Kassa)
      .returning('id')
      .execute();
    return data;
  }
}
