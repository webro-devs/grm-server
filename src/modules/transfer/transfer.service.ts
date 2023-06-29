import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { DataSource, EntityManager, FindOptionsWhere } from 'typeorm';
import { CreateTransferDto, UpdateTransferDto } from './dto';

import { Transfer } from './transfer.entity';
import { ProductService } from '../product/product.service';
import { TransferRepository } from './transfer.repository';
import { CreateProductDto } from '../product/dto';

Injectable();
export class TransferService {
  constructor(
    @InjectRepository(Transfer)
    private readonly transferRepository: TransferRepository,
    private readonly productService: ProductService,
    private readonly connection: DataSource,
  ) {}
  async getAll(
    options: IPaginationOptions,
    where?: FindOptionsWhere<Transfer>,
  ): Promise<Pagination<Transfer>> {
    return paginate<Transfer>(this.transferRepository, options, {
      relations: {
        from: true,
        to: true,
        transferer: true,
        product: true,
      },
    });
  }

  async getById(id: string) {
    const data = await this.transferRepository.findOne({
      where: { id },
      relations: {
        from: true,
        to: true,
        transferer: true,
        product: true,
      },
    });
    if (!data) {
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    }
    return data;
  }

  async deleteOne(id: string) {
    const response = await this.transferRepository.delete(id);
    return response;
  }

  async change(value: UpdateTransferDto, id: string) {
    const response = await this.transferRepository
      .createQueryBuilder()
      .update()
      .set(value as unknown as Transfer)
      .where('id = :id', { id })
      .execute();
    return response;
  }

  async create(values: CreateTransferDto[], id: string) {
    if (values.length) {
      for (const item of values) {
        const product = await this.createNewProduct(
          item.product,
          item.count,
          item.to,
        );
        const data = { ...item, product, transferer: id };
        const response = this.transferRepository
          .createQueryBuilder()
          .insert()
          .into(Transfer)
          .values(data as unknown as Transfer)
          .returning('id')
          .execute();
      }
    }
    return 'Successfully transferred';
  }
  async createNewProduct(
    id: string,
    count: number,
    filial: string,
  ): Promise<string> {
    const product = await this.productService.getOne(id);
    if (count > product.count) {
      throw new HttpException('Not enough product', HttpStatus.BAD_REQUEST);
    }
    product.count -= count;
    product.setTotalSize();
    await this.connection.transaction(async (manager: EntityManager) => {
      await manager.save(product);
    });
    const newProduct: CreateProductDto = {
      code: product.code,
      color: product.color,
      count: count,
      date: product.date,
      filial,
      imgUrl: product.imgUrl,
      model: product.model.id,
      price: product.price,
      comingPrice: product.comingPrice,
      shape: product.shape,
      size: product.size,
      style: product.style,
      totalSize: product.totalSize,
      x: product.x,
      y: product.y,
    };
    const result = await this.productService.create([newProduct]);
    return result.raw[0].id;
  }
}
