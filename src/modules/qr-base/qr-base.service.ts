import { NotFoundException, Injectable } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

import { CreateQrBaseDto, UpdateQrBaseDto } from './dto';
import { QrBase } from './qr-base.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class QrBaseService {
  constructor(
    @InjectRepository(QrBase)
    private readonly qrBaseRepository: Repository<QrBase>,
  ) {}

  async getAll() {
    return await this.qrBaseRepository.find({
      order: {
        date: 'ASC',
      },
    });
  }

  async getOne(id: string) {
    const data = await this.qrBaseRepository
      .findOne({
        where: { id },
      })
      .catch(() => {
        throw new NotFoundException('data not found');
      });

    return data;
  }

  async getOneByCode(code: string) {
    const data = await this.qrBaseRepository
      .findOne({
        where: { code },
      })
      .catch(() => {
        throw new NotFoundException('data not found');
      });

    return data;
  }

  async deleteOne(id: string) {
    const response = await this.qrBaseRepository.delete(id).catch(() => {
      throw new NotFoundException('data not found');
    });
    return response;
  }

  async change(value: UpdateQrBaseDto, id: string) {
    const response = await this.qrBaseRepository
      .createQueryBuilder()
      .update()
      .set(value as unknown as QrBase)
      .where('id = :id', { id })
      .execute();
    return response;
  }

  async create(value: CreateQrBaseDto) {
    const data = this.qrBaseRepository.create(value);
    return await this.qrBaseRepository.save(data);
  }
}
