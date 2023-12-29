import { NotFoundException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { FindOptionsWhere, Repository } from 'typeorm';

import { Size } from './size.entity';
import { CreateSizeDto, UpdateSizeDto } from './dto';

Injectable();
export class SizeService {
  constructor(
    @InjectRepository(Size)
    private readonly sizeRepository: Repository<Size>,
  ) {}

  async getAll() {
    return await this.sizeRepository.find({
      order: {
        title: 'ASC',
      },
    });
  }

  async getOne(id: string) {
    const data = await this.sizeRepository
      .findOne({
        where: { id },
      })
      .catch(() => {
        throw new NotFoundException('Size not found');
      });

    return data;
  }

  async getOneByName(title: string) {
    const data = await this.sizeRepository
      .findOne({
        where: { title },
      })
      .catch(() => {
        throw new NotFoundException('Size not found');
      });

    return data;
  }

  async deleteOne(id: string) {
    const response = await this.sizeRepository.delete(id).catch(() => {
      throw new NotFoundException('Size not found');
    });
    return response;
  }

  async change(value: UpdateSizeDto, id: string) {
    const response = await this.sizeRepository.update({ id }, value);
    return response;
  }

  async create(value: CreateSizeDto) {
    const data = this.sizeRepository.create(value);
    return await this.sizeRepository.save(data);
  }

  async findOrCreate(title) {
    const response = await this.sizeRepository.findOne({
      where: { title },
    });

    if (!response) {
      return (await this.create(title)).id;
    }
    return response.id;
  }
}
