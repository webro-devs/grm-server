import { NotFoundException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { FindOptionsWhere, Repository } from 'typeorm';

import { Platte } from './platte.entity';
import { CreatePlatteDto, UpdatePlatteDto } from './dto';

Injectable();
export class PlatteService {
  constructor(
    @InjectRepository(Platte)
    private readonly colorRepository: Repository<Platte>,
  ) {}

  async getAll() {
    return await this.colorRepository.find({
      order: {
        title: 'ASC',
      },
    });
  }

  async getOne(id: string) {
    const data = await this.colorRepository
      .findOne({
        where: { id },
      })
      .catch(() => {
        throw new NotFoundException('Palette not found');
      });

    return data;
  }

  async getOneByName(title: string) {
    const data = await this.colorRepository
      .findOne({
        where: { title },
      })
      .catch(() => {
        throw new NotFoundException('Palette not found');
      });

    return data;
  }

  async deleteOne(id: string) {
    const response = await this.colorRepository.delete(id).catch(() => {
      throw new NotFoundException('Palette not found');
    });
    return response;
  }

  async change(value: UpdatePlatteDto, id: string) {
    const response = await this.colorRepository.update({ id }, value);
    return response;
  }

  async create(value: CreatePlatteDto) {
    const data = this.colorRepository.create(value);
    return await this.colorRepository.save(data);
  }
}
