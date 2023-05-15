import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { FindOptionsWhere } from 'typeorm';
import { CreateActionDto, UpdateActionDto } from './dto';

import { Action } from './action.entity';
import { ActionRepository } from './action.repository';

Injectable();
export class ActionService {
  constructor(
    @InjectRepository(Action)
    private readonly actionRepository: ActionRepository,
  ) {}
  async getAll(
    options: IPaginationOptions,
    where?: FindOptionsWhere<Action>,
  ): Promise<Pagination<Action>> {
    return paginate<Action>(this.actionRepository, options, {});
  }

  async getById(id: string) {
    const data = await this.actionRepository.findOne({
      where: { id },
    });
    if (!data) {
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    }
    return data;
  }

  async deleteOne(id: string) {
    const response = await this.actionRepository.delete(id);
    return response;
  }

  async change(value: UpdateActionDto, id: string) {
    const response = await this.actionRepository
      .createQueryBuilder()
      .update()
      .set(value as unknown as Action)
      .where('id = :id', { id })
      .execute();
    return response;
  }

  async create(value: CreateActionDto, id: string) {
    const data = { ...value, transferer: id };
    const response = this.actionRepository
      .createQueryBuilder()
      .insert()
      .into(Action)
      .values(data as unknown as Action)
      .returning('id')
      .execute();
    return response;
  }
}
