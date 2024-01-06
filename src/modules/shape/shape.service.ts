import { NotFoundException, Injectable } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';

import { UpdateShapeDto, CreateShapeDto } from './dto';
import { Shape } from './shape.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ShapeService {
  constructor(
    @InjectRepository(Shape)
    private readonly shapeRepository: Repository<Shape>,
  ) {}

  async getAll() {
    return await this.shapeRepository.find({
      order: {
        title: 'ASC',
      },
    });
  }

  async getOne(id: string) {
    const data = await this.shapeRepository
      .findOne({
        where: { id },
      })
      .catch(() => {
        throw new NotFoundException('Shape not found');
      });

    return data;
  }

  async getOneByName(title: string) {
    const data = await this.shapeRepository
      .findOne({
        where: { title },
      })
      .catch(() => {
        throw new NotFoundException('Shape not found');
      });

    return data;
  }

  async deleteOne(id: string) {
    const response = await this.shapeRepository.delete(id).catch(() => {
      throw new NotFoundException('Shape not found');
    });
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

  async findOrCreate(title) {
    const response = await this.shapeRepository.findOne({
      where: { title },
    });

    if (!response) {
      console.log(title);
      const shape = await this.create({ title });
      console.log('inside', shape);

      return shape.id;
    }
    return response.id;
  }
}
