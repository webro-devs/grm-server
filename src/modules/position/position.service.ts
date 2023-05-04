import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

import { UpdatePositionDto, CreatePositionDto } from './dto';
import { Position } from './position.entity';
import { PositionRepository } from './position.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PositionService {
  constructor(
    @InjectRepository(Position)
    private readonly positionRepository: PositionRepository,
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
    const position = await this.positionRepository.findOne({
      // relations: {
      //   users: {},
      // },
      where: { id },
    });

    if (!position) {
      throw new HttpException('Position not found', HttpStatus.NOT_FOUND);
    }

    return position;
  }

  async deleteOne(id: string) {
    const response = await this.positionRepository.delete(id);
    return response;
  }

  async change(value: UpdatePositionDto, id: string) {
    const response = await this.positionRepository.update({ id }, value);
    return response;
  }

  async create(value: CreatePositionDto) {
    const data = await this.positionRepository.create(value);
    return await this.positionRepository.save(data);
  }
}
