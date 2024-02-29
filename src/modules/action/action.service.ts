import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { ActionDescEnum, ActionTypeEnum } from 'src/infra/shared/enum';
import { Between, FindOptionsWhere, InsertResult } from 'typeorm';

import { Action } from './action.entity';
import { ActionRepository } from './action.repository';
import { CreateActionDto } from './dto';

Injectable();
export class ActionService {
  constructor(
    @InjectRepository(Action)
    private readonly actionRepository: ActionRepository,
  ) {}

  async getAll(options: IPaginationOptions, query?): Promise<Pagination<Action>> {
    if (!query.to) {
      let tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(23, 59, 59, 999);
      query.to = tomorrow;
    }

    if (!query.from) {
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      query.from = today;
    }
    let to = new Date(query.to);
    let from = new Date(query.from);

    to.setHours(23, 59, 59, 999);
    from.setHours(0, 0, 0, 1);

    const date = Between(from, to);
    return paginate<Action>(this.actionRepository, options, {
      relations: { filial: true, user: { filial: true, position: true } },
      order: { date: 'DESC' },
      where: { date: Between(from, to) },
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
