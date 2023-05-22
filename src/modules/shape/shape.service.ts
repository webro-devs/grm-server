import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

import { UpdateShapeDto, CreateShapeDto } from './dto';
import { Shape } from './shape.entity';
import { ShapeRepository } from './shape.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ShapeService {
  constructor(
    @InjectRepository(Shape)
    private readonly shapeRepository: ShapeRepository,
  ) { }

  async getAll(
    options: IPaginationOptions,
    where?: FindOptionsWhere<Shape>,
  ): Promise<Pagination<Shape>> {
    return paginate<Shape>(this.shapeRepository, options, {
      order: {
        title: 'ASC',
      },
    });
  }

  async getOne(id: string) {
    const data = await this.shapeRepository.findOne({
      where: { id },
    });

    if (!data) {
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    }

    return data;
  }

  async deleteOne(id: string) {
    const response = await this.shapeRepository.delete(id);
    return response;
  }

  async change(value: UpdateShapeDto, id: string) {
    const response = await this.shapeRepository.update({ id }, value);
    return response;
  }

  async create(value: CreateShapeDto) {
    const data = this.shapeRepository.create(value);
    return await this.shapeRepository.save(data);
  }
}
