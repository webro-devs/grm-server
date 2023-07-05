import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { ActionDescEnum, ActionTypeEnum } from 'src/infra/shared/enum';
import { FindOptionsWhere } from 'typeorm';

import { Action } from './action.entity';
import { ActionRepository } from './action.repository';
import { CreateActionDto } from './dto';

Injectable();
export class ActionService {
  constructor(
    @InjectRepository(Action)
    private readonly actionRepository: ActionRepository,
  ) {}

  async getAll(options: IPaginationOptions): Promise<Pagination<Action>> {
    return paginate<Action>(this.actionRepository, options);
  }

  async create(
    data: CreateActionDto,
    user: string,
    filial: string,
    key: string,
  ) {
    const value: CreateActionDto = {
      user,
      filial,
      desc: ActionDescEnum[key],
      type: ActionTypeEnum[key],
      info: data,
    };

    const response = await this.actionRepository
      .createQueryBuilder()
      .insert()
      .into(Action)
      .values(value as unknown as Action)
      .returning('id')
      .execute();

    return response;
  }
}
