import { NotFoundException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { FindOptionsWhere, Repository } from 'typeorm';

import { Model } from './model.entity';
import { CreateModelDto, UpdateModelDto } from './dto';

Injectable();
export class ModelService {
  constructor(
    @InjectRepository(Model)
    private readonly modelRepository: Repository<Model>,
  ) {}

  async getAll(options: IPaginationOptions, where?: FindOptionsWhere<Model>): Promise<Pagination<Model>> {
    return paginate<Model>(this.modelRepository, options, {
      order: {
        title: 'ASC',
      },
      relations: {
        collection: true,
      },
    });
  }

  async getAllModel() {
    return await this.modelRepository.find({
      order: {
        title: 'ASC',
      },
      relations: {
        collection: true,
      },
    });
  }

  async getOne(id: string) {
    const data = await this.modelRepository.findOne({
      where: { id },
      relations: { collection: true },
    });

    return data;
  }

  async getOneExcel(id: string) {
    const data = await this.modelRepository.findOne({
      where: { id },
      relations: { productsExcel: { partiya: true } },
    });

    return data;
  }

  async productByExcel(id: string) {
    const data = await this.modelRepository.findOne({
      where: { id },
      relations: {
        productsExcel: { color: true, style: true, size: true, shape: true },
        collection: true,
      },
    });

    return data;
  }

  async getOneByName(title: string) {
    const data = await this.modelRepository
      .findOne({
        where: { title },
        relations: { collection: true },
      })
      .catch(() => {
        throw new NotFoundException('Model not found');
      });

    return data;
  }

  async deleteOne(id: string) {
    const response = await this.modelRepository.delete(id).catch(() => {
      throw new NotFoundException('Model not found');
    });
    return response;
  }

  async change(value: UpdateModelDto, id: string) {
    const response = await this.modelRepository
      .createQueryBuilder()
      .update()
      .set(value as unknown as Model)
      .where('id = :id', { id })
      .execute();
    return response;
  }

  async create(value: CreateModelDto) {
    const response = this.modelRepository
      .createQueryBuilder()
      .insert()
      .into(Model)
      .values(value as unknown as Model)
      .returning('id')
      .execute();
    return response;
  }

  async findOrCreate(title, collection) {
    const response = await this.modelRepository.findOne({
      where: { title },
    });

    if (!response) {
      return (await this.create({ collection, title })).raw[0].id;
    }
    return response.id;
  }
}
