import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { FindOptionsWhere } from 'typeorm';

import { Model } from './model.entity';
import { ModelRepository } from './model.repository';
import { CreateModelDto, UpdateModelDto } from './dto';

Injectable();
export class ModelService {
  constructor(
    @InjectRepository(Model)
    private readonly modelRepository: ModelRepository,
  ) {}

  async getAll(
    options: IPaginationOptions,
    where?: FindOptionsWhere<Model>,
  ): Promise<Pagination<Model>> {
    return paginate<Model>(this.modelRepository, options, {
      order: {
        title: 'ASC',
      },
    });
  }

  async getOne(id: string) {
    const data = await this.modelRepository.findOne({
      where: { id },
    });

    if (!data) {
      throw new HttpException('data not found', HttpStatus.NOT_FOUND);
    }

    return data;
  }

  async deleteOne(id: string) {
    const response = await this.modelRepository.delete(id);
    return response;
  }

  async change(value: UpdateModelDto, id: string) {
    const response = await this.modelRepository
    .createQueryBuilder()
    .update()
    .set(value as unknown as Model)
    .where('id = :id', { id })
    .execute();
  return response;
  }

  async create(value: CreateModelDto) {
    const response = this.modelRepository
      .createQueryBuilder()
      .insert()
      .into(Model)
      .values(value as unknown as Model)
      .returning('id')
      .execute();
    return response;
  }
}
