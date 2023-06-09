import {
  NotFoundException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { FindOptionsWhere, Repository } from 'typeorm';

import { Collection } from './collection.entity';
import { CreateCollectionDto, UpdateCollectionDto } from './dto';

Injectable();
export class CollectionService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
  ) {}

  async getAll(
    options: IPaginationOptions,
    where?: FindOptionsWhere<Collection>,
  ): Promise<Pagination<Collection>> {
    return paginate<Collection>(this.collectionRepository, options, {
      order: {
        title: 'ASC',
      },
    });
  }

  async getOne(id: string) {
    const data = await this.collectionRepository
      .findOne({
        where: { id },
      })
      .catch(() => {
        throw new NotFoundException('data not found');
      });

    return data;
  }

  async deleteOne(id: string) {
    const response = await this.collectionRepository.delete(id).catch(() => {
      throw new NotFoundException('data not found');
    });
    return response;
  }

  async change(value: UpdateCollectionDto, id: string) {
    const response = await this.collectionRepository.update({ id }, value);
    return response;
  }

  async create(value: CreateCollectionDto) {
    const data = this.collectionRepository.create(value);
    return await this.collectionRepository.save(data);
  }

  async remainingProductsByCollection() {
    const data = await this.collectionRepository.find({
      relations: { model: { products: true } },
    });
    let result = [];
    for (let i = 0; i < data.length; i++) {
      let remainingSum = 0,
        remainingSize = 0,
        remainingCount = 0;
      for (let j = 0; j < data[i].model.length; j++) {
        const products = data[i].model[j].products;
        remainingSum += products.length
          ? products.map((p) => +p.price * p.count).reduce((a, b) => a + b)
          : 0;
        remainingSize += products.length
          ? products.map((p) => +p.totalSize).reduce((a, b) => a + b)
          : 0;
        remainingCount += products.length
          ? products.map((p) => p.count).reduce((a, b) => a + b)
          : 0;
      }
      result.push({
        remainingCount,
        remainingSize,
        remainingSum,
        title: data[i].title,
      });
    }
    return result;
  }
}
