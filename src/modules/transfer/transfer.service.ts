import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { FindOptionsWhere } from 'typeorm';
import { CreateTransferDto, UpdateTransferDto } from './dto';

import { Transfer } from './transfer.entity';
import { ProductService } from '../product/product.service';
import { TransferRepository } from './transfer.repository';

Injectable();
export class TransferService {
  constructor(
    @InjectRepository(Transfer)
    private readonly transferRepository: TransferRepository,
    private readonly productService: ProductService,
  ) {}
  async getAll(
    options: IPaginationOptions,
    where?: FindOptionsWhere<Transfer>,
  ): Promise<Pagination<Transfer>> {
    return paginate<Transfer>(this.transferRepository, options, {
      relations: {
        from: true,
        to: true,
        transferer: true,
        product: true,
      },
    });
  }

  async getById(id: string) {
    const data = await this.transferRepository.findOne({
      where: { id },
      relations: {
        from: true,
        to: true,
        transferer: true,
        product: true,
      },
    });
    if (!data) {
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    }
    return data;
  }

  async deleteOne(id: string) {
    const response = await this.transferRepository.delete(id);
    return response;
  }

  async change(value: UpdateTransferDto, id: string) {
    const response = await this.transferRepository
      .createQueryBuilder()
      .update()
      .set(value as unknown as Transfer)
      .where('id = :id', { id })
      .execute();
    return response;
  }

  async create(value: CreateTransferDto, id: string) {
    const product = await this.productService.getOne(value.product);
    if (value.count > product.count) {
      return '';
    }
    const data = { ...value, transferer: id };
    const response = this.transferRepository
      .createQueryBuilder()
      .insert()
      .into(Transfer)
      .values(data as unknown as Transfer)
      .returning('id')
      .execute();
    return response;
  }
}
