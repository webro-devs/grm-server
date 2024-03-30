import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { ActionDescEnum, ActionTypeEnum } from 'src/infra/shared/enum';
import { Between, Equal, InsertResult, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

import { Action } from './action.entity';
import { ActionRepository } from './action.repository';

Injectable();
export class ActionService {
  constructor(
    @InjectRepository(Action)
    private readonly actionRepository: ActionRepository,
  ) {}

  async getAll(options: IPaginationOptions, query?): Promise<Pagination<Action>> {
    let where = {};
    if (!query.endDate) {
      let tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(23, 59, 59, 999);
      query.endDate = tomorrow;
    }
    if (!query.startDate) {
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      query.startDate = today;
    }
    let to = new Date(query.endDate);
    let from = new Date(query.startDate);

    to.setHours(23, 59, 59, 999);
    from.setHours(0, 0, 0, 1);

    if (query.endDate && query.startDate) {
      where = {
        date: Between(from, to),
      };
    } else if (query.startDate) {
      where = {
        date: MoreThanOrEqual(from),
      };
    } else if (query.endDate) {
      where = {
        date: LessThanOrEqual(to),
      };
    }

    if (query.filial && query.filial != 'boss' && query.filial != 'manager') {
      where = { ...where, user: { filial: { id: Equal(query.filial) } } };
    } else if (query?.filial?.toLowerCase() == 'boss') {
      where = { ...where, user: { role: 5 } };
    } else if (query?.filial?.toLowerCase() == 'manager') {
      where = { ...where, user: { role: 3 } };
    }

    return paginate<Action>(this.actionRepository, options, {
      relations: { filial: true, user: { filial: true, position: true } },
      order: { date: 'DESC' },
      where,
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

  async getOne(id: string) {
    return await this.actionRepository.findOne({ where: { id }, relations: { user: true } });
  }
}
