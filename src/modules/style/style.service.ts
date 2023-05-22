import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

import { UpdateStyleDto, CreateStyleDto } from './dto';
import { Style } from './style.entity';
import { StyleRepository } from './Style.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StyleService {
  constructor(
    @InjectRepository(Style)
    private readonly styleRepository: StyleRepository,
  ) { }

  async getAll(
    options: IPaginationOptions,
    where?: FindOptionsWhere<Style>,
  ): Promise<Pagination<Style>> {
    return paginate<Style>(this.styleRepository, options, {
      order: {
        title: 'ASC',
      },
    });
  }

  async getOne(id: string) {
    const data = await this.styleRepository.findOne({
      where: { id },
    });

    if (!data) {
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    }

    return data;
  }

  async deleteOne(id: string) {
    const response = await this.styleRepository.delete(id);
    return response;
  }

  async change(value: UpdateStyleDto, id: string) {
    const response = await this.styleRepository.update({ id }, value);
    return response;
  }

  async create(value: CreateStyleDto) {
    const data = this.styleRepository.create(value);
    return await this.styleRepository.save(data);
  }
}
