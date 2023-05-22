import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { FindOptionsWhere } from 'typeorm';

import { Color } from './color.entity';
import { ColorRepository } from './color.repository';
import { CreateColorDto, UpdateColorDto } from './dto';

Injectable();
export class ColorService {
  constructor(
    @InjectRepository(Color)
    private readonly colorRepository: ColorRepository,
  ) {}

  async getAll(
    options: IPaginationOptions,
    where?: FindOptionsWhere<Color>,
  ): Promise<Pagination<Color>> {
    return paginate<Color>(this.colorRepository, options, {
      order: {
        title: 'ASC',
      },
    });
  }

  async getOne(id: string) {
    const data = await this.colorRepository.findOne({
      where: { id },
    });

    if (!data) {
      throw new HttpException('data not found', HttpStatus.NOT_FOUND);
    }

    return data;
  }

  async deleteOne(id: string) {
    const response = await this.colorRepository.delete(id);
    return response;
  }

  async change(value: UpdateColorDto, id: string) {
    const response = await this.colorRepository.update({ id }, value);
    return response;
  }

  async create(value: CreateColorDto) {
    const data = this.colorRepository.create(value);
    return await this.colorRepository.save(data);
  }
}
