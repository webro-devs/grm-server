import { NotFoundException, Injectable } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

import { UpdatePositionDto, CreatePositionDto } from './dto';
import { Position } from './position.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PositionService {
  constructor(
    @InjectRepository(Position)
    private readonly positionRepository: Repository<Position>,
  ) {}

  async getAll(
    options: IPaginationOptions,
    where?: FindOptionsWhere<Position>,
  ): Promise<Pagination<Position>> {
    return paginate<Position>(this.positionRepository, options, {
      order: {
        title: 'ASC',
      },
    });
  }

  async getOne(id: string) {
    const data = await this.positionRepository
      .findOne({
        where: { id },
      })
      .catch(() => {
        throw new NotFoundException('data not found');
      });

    return data;
  }

  async deleteOne(id: string) {
    const response = await this.positionRepository.delete(id).catch(() => {
      throw new NotFoundException('data not found');
    });
    return response;
  }

  async change(value: UpdatePositionDto, id: string) {
    const response = await this.positionRepository.update({ id }, value);
    return response;
  }

  async create(value: CreatePositionDto) {
    const data = this.positionRepository.create(value);
    return await this.positionRepository.save(data);
  }
}
