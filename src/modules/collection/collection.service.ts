import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { FindOptionsWhere } from 'typeorm';

import { Collection } from './collection.entity';
import { CollectionRepository } from './collection.repository';
import { CreateCollectionDto, UpdateCollectionDto } from './dto';

Injectable();
export class CollectionService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: CollectionRepository,
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
    const data = await this.collectionRepository.findOne({
      where: { id },
    });

    if (!data) {
      throw new HttpException('data not found', HttpStatus.NOT_FOUND);
    }

    return data;
  }

  async deleteOne(id: string) {
    const response = await this.collectionRepository.delete(id);
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
}
