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
import sizeParser from 'src/infra/helpers/size-parser';
import { FilialService } from '../filial/filial.service';

Injectable();
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: ProductRepository,
    private readonly filialService: FilialService,
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
      where,
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

  async create(value: CreateProductDto[]) {
    value = this.setXy(value);
    const data = await this.productRepository
      .createQueryBuilder()
      .insert()
      .into(Product)
      .values(value as unknown as Product)
      .returning('id')
      .execute();

    return data;
  }

  setXy(value: CreateProductDto[]): CreateProductDto[] {
    for (let i = 0; i < value.length; i++) {
      const xy = sizeParser(value[i].size);
      value[i].x = xy[0];
      value[i].y = xy[1];
      value[i].size = xy.join('x');
      value[i].totalSize = +xy[0] * +xy[1] * value[i].count;
    }
    return value;
  }
  async remainingProducts(where) {
    const data = await this.productRepository.find({
      where,
    });
    const remainingSum = data.length
      ? data.map((p) => +p.price * p.count).reduce((a, b) => a + b)
      : 0;
    const remainingSize = data.length
      ? data.map((p) => +p.totalSize).reduce((a, b) => a + b)
      : 0;
    const count = data.length
      ? data.map((p) => p.count).reduce((a, b) => a + b)
      : 0;
    return { remainingSize, remainingSum, count };
  }

  async getRemainingProductsForAllFilial() {
    const result = [];
    const allFilial = await this.filialService.getAllFilial();
    for (let data of allFilial) {
      const remain = await this.remainingProducts({ filial: { id: data.id } });
      result.push({ ...data, ...remain });
    }
    return result;
  }
}
