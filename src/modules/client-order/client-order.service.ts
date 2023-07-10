import { NotFoundException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

import { UpdateClientOrderDto, CreateClientOrderDto } from './dto';
import { ClientOrder } from './client-order.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ClientOrderService {
  constructor(
    @InjectRepository(ClientOrder)
    private readonly clientOrder: Repository<ClientOrder>,
  ) {}

  async getAll(options: IPaginationOptions): Promise<Pagination<ClientOrder>> {
    return paginate<ClientOrder>(this.clientOrder, options);
  }

  async getOne(id: string) {
    const data = await this.clientOrder
      .findOne({
        where: { id },
      })
      .catch(() => {
        throw new NotFoundException('data not found');
      });

    return data;
  }

  async deleteOne(id: string) {
    const response = await this.clientOrder.delete(id).catch(() => {
      throw new NotFoundException('data not found');
    });
    return response;
  }

  async change(value: UpdateClientOrderDto, id: string) {
    const response = await this.clientOrder.createQueryBuilder()
    .update()
    .set(value as unknown as ClientOrder)
    .where('id = :id', { id })
    .execute();
    return response;
  }

  async create(value: CreateClientOrderDto) {
    const data = this.clientOrder
      .createQueryBuilder()
      .insert()
      .into(ClientOrder)
      .values(value as unknown as ClientOrder)
      .execute();

    return data;
  }
}
