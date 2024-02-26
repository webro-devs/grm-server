import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { ActionDescEnum, ActionTypeEnum } from 'src/infra/shared/enum';
import { FindOptionsWhere, InsertResult } from 'typeorm';

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
    return paginate<Action>(this.actionRepository, options, {
      relations: { filial: true, user: { filial: true, position: true } },
      order: { date: 'DESC' },
    });
  }

  async create(data, user: string, filial, key: string, additional?: string): Promise<InsertResult> {
    const value = {
      user,
      ...(filial && { filial }),
      desc: ActionDescEnum[key],
      type: ActionTypeEnum[key],
      info: data,
    };

    if (additional) {
      value.desc = value.desc + ' ' + additional;
    }

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
