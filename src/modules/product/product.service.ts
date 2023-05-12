import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere } from 'typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { Product } from './product.entity';
import { ProductRepository } from './product.repository';
import { CreateProductDto, UpdateProductDto } from './dto';

Injectable();
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: ProductRepository,
  ) {}

  async getAll(
    options: IPaginationOptions,
    where?: FindOptionsWhere<Product>,
  ): Promise<Pagination<Product>> {
    return paginate<Product>(this.productRepository, options, {
      relations: {
        model: {
          collection: true,
        },
      },
    });
  }

  async getOne(id: string) {
    const data = await this.productRepository.findOne({
      where: { id },
      relations: {
        model: {
          collection: true,
        },
      },
    });

    if (!data) {
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    }

    return data;
  }

  async deleteOne(id: string) {
    const response = await this.productRepository.delete(id);
    return response;
  }

  async change(value: UpdateProductDto, id: string) {
    const response = await this.productRepository
      .createQueryBuilder()
      .update()
      .set(value as unknown as Product)
      .where('id = :id', { id })
      .execute();
    return response;
  }

  async create(value: CreateProductDto) {
    const data = this.productRepository
      .createQueryBuilder()
      .insert()
      .into(Product)
      .values(value as unknown as Product)
      .returning('id')
      .execute();
    return data;
  }
}
