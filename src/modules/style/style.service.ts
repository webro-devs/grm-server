import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

import { UpdateStyleDto, CreateStyleDto } from './dto';
import { Style } from './style.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StyleService {
  constructor(
    @InjectRepository(Style)
    private readonly styleRepository: Repository<Style>,
  ) {}

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
    const data = await this.styleRepository
      .findOne({
        where: { id },
      })
      .catch(() => {
        throw new NotFoundException('data not found');
      });

    return data;
  }

  async deleteOne(id: string) {
    const response = await this.styleRepository.delete(id).catch(() => {
      throw new NotFoundException('data not found');
    });
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
