import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { FindOptionsWhere } from 'typeorm';

import { Action } from './action.entity';
import { ActionRepository } from './action.repository';
import { CreateActionDto, UpdateActionDto } from './dto';

Injectable();
export class ActionService {
  constructor(
    @InjectRepository(Action)
    private readonly actionRepository: ActionRepository,
  ) {}

  async getAll(
    options: IPaginationOptions,
    where?: FindOptionsWhere<Color>,
  ): Promise<Pagination<Action>> {
    return paginate<Action>(this.actionRepository, options, {
      order: {
        title: 'ASC',
      },
    });
  }

  async getOne(id: string) {
    const data = await this.actionRepository.findOne({
      where: { id },
    });

    if (!data) {
      throw new HttpException('data not found', HttpStatus.NOT_FOUND);
    }

    return data;
  }

  async deleteOne(id: string) {
    const response = await this.actionRepository.delete(id);
    return response;
  }

  async change(value: UpdateActionDto, id: string) {
    const response = await this.actionRepository.update({ id }, value);
    return response;
  }

  async create(value: CreateActionDto) {
    const data = this.actionRepository.create(value);
    return await this.actionRepository.save(data);
  }
}
