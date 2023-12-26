import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import {
  DataSource,
  EntityManager,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { CreateTransferDto, UpdateTransferDto } from './dto';

import { Transfer } from './transfer.entity';
import { ProductService } from '../product/product.service';
import { CreateProductDto } from '../product/dto';
import { UserService } from '../user/user.service';

Injectable();
export class TransferService {
  constructor(
    @InjectRepository(Transfer)
    private readonly transferRepository: Repository<Transfer>,
    private readonly productService: ProductService,
    private readonly userService: UserService,
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
    const data = await this.transferRepository
      .findOne({
        where: { id },
        relations: {
          from: true,
          to: true,
          transferer: true,
          product: true,
        },
      })
      .catch(() => {
        throw new NotFoundException('data not found');
      });

    return data;
  }

  async deleteOne(id: string) {
    const response = await this.transferRepository.delete(id).catch(() => {
      throw new NotFoundException('data not found');
    });
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
      await Promise.all(
        values.map(async (value) => {
          await this.takeProduct(value.product, value.count);
          await this.transferRepository
            .createQueryBuilder()
            .insert()
            .into(Transfer)
            .values({ ...value, transferer: id } as unknown as Transfer)
            .returning('id')
            .execute();
        }),
      );
    }
  }

  async takeProduct(id: string, count: number) {
    const product = await this.productService.getById(id);
    if (count > product.count) {
      throw new HttpException('Not enough product', HttpStatus.BAD_REQUEST);
    }
    product.count -= count;

    product.setTotalSize();
    await this.connection.transaction(async (manager: EntityManager) => {
      await manager.save(product);
    });
  }

  async checkTransfer(id: string, userId: string) {
    const transfer = await this.transferRepository.findOne({
      where: { id },
      relations: { product: { color: true }, transferer: true, to: true },
    });

    const product = transfer.product;
    const newProduct: CreateProductDto = {
      code: product.code,
      color: product.color.id,
      count: transfer.count,
      date: product.date,
      filial: transfer.to.id,
      imgUrl: product.imgUrl,
      model: product.model.id,
      price: product.price,
      comingPrice: product.comingPrice,
      priceMeter: product.priceMeter,
      shape: product.shape,
      size: product.size,
      style: product.style,
      otherImgs: product.otherImgs,
      totalSize: product.x * product.y * transfer.count,
      x: product.x,
      y: product.y,
      partiya: product.partiya.id,
      price2: product.price2,
      palette: product.palette.id,
      country: product.country,
    };

    await this.productService.create([newProduct]);

    const cashier = await this.userService.getOne(userId);

    await this.transferRepository.update(id, { cashier });

    return 'Ok';
  }
}
