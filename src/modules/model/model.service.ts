import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
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
    return await this.modelRepository.findOne({
      where: { id },
      relations: { collection: true },
    });
  }

  async getOneExcel(id: string) {
    return await this.modelRepository.findOne({
      where: { id },
      relations: { productsExcel: { partiya: true } },
    });
  }

  async productByExcel(id: string, partiyaId) {
    const data = await this.modelRepository.findOne({
      relations: {
        productsExcel: { color: true, style: true, size: true, shape: true, partiya: true },
        collection: true,
      },
      where: { id, productsExcel: { partiya: { id: partiyaId } } },
    });

    if(!data?.productsExcel){
      data.productsExcel = []
    }

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

  async findOrCreate(collection: string, title: string) {
    const response = await this.modelRepository.findOne({
      where: { title, collection: { id: collection } },
      relations: { collection: true },
    });

    if (!response) {
      const value = { title, collection };

      const responsee = this.modelRepository
        .createQueryBuilder()
        .insert()
        .into(Model)
        .values(value as unknown as Model)
        .returning('id')
        .execute();

      return (await responsee).raw[0].id;
    }
    return response.id;
  }
}
