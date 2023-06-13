import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere } from 'typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

import { Partiya } from './partiya.entity';
import { PartiyaRepository } from './partiya.repository';
import { CreatePartiyaDto, UpdatePartiyaDto } from './dto';
import { partiyaDateSort } from '../../infra/helpers';

Injectable();
export class PartiyaService {
  constructor(
    @InjectRepository(Partiya)
    private readonly partiyaRepository: PartiyaRepository,
  ) {}

  async getAll(
    options: IPaginationOptions,
    where?: FindOptionsWhere<Partiya>,
  ): Promise<Pagination<Partiya>> {
    return paginate<Partiya>(this.partiyaRepository, options, {});
  }

  async getAllByDateRange() {
    const data = await this.partiyaRepository.find({ order: { date: 'DESC' } });
    const res = partiyaDateSort(data);
    return res;
  }

  async getOne(id: string) {
    const data = await this.partiyaRepository.findOne({
      where: { id },
    });

    if (!data) {
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    }

    return data;
  }

  async deleteOne(id: string) {
    const response = await this.partiyaRepository.delete(id);
    return response;
  }

  async change(value: UpdatePartiyaDto, id: string) {
    const response = await this.partiyaRepository.update({ id }, value);
    return response;
  }

  async create(value: CreatePartiyaDto) {
    const data = this.partiyaRepository.create(value);
    return await this.partiyaRepository.save(data);
  }
}
