import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { DataSource, EntityManager, FindOptionsWhere, Repository } from 'typeorm';
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
  async getAll(options: IPaginationOptions, where?: FindOptionsWhere<Transfer>): Promise<Pagination<Transfer>> {
    return paginate<Transfer>(this.transferRepository, options, {
      relations: {
        from: true,
        to: true,
        transferer: true,
        product: true,
      },
      order: { date: 'DESC' },
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
          product: { color: true, partiya: true, model: true },
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

  async giveProduct(id: string, count: number) {
    const product = await this.productService.getById(id);

    product.count += count;

    product.setTotalSize();
    await this.connection.transaction(async (manager: EntityManager) => {
      await manager.save(product);
    });
  }

  async checkTransfer(id: string, userId: string) {
    const transfer = await this.transferRepository.findOne({
      where: { id },
      relations: { product: { color: true, model: true, partiya: true }, transferer: true, to: true },
    });
    if (transfer.isChecked) {
      throw new BadRequestException('Transfer already ended!');
    }

    const product = transfer.product;
    const newProduct: CreateProductDto = {
      code: product?.code || null,
      color: product.color.id,
      count: transfer.count,
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
      secondPrice: product.secondPrice,
      country: product.country,
    };

    console.log('newProduct===>', newProduct);

    const res = await this.productService.create([newProduct]);
    console.log('created product===>', res);

    const cashier = await this.userService.getOne(userId);

    await this.transferRepository.update(id, { cashier, progres: 'Accepted', isChecked: true });

    return 'Ok';
  }

  async rejectProduct(id: string, userId: string) {
    const transfer = await this.transferRepository.findOne({ where: { id }, relations: { product: true } });
    if (transfer.isChecked) {
      throw new BadRequestException('Transfer already ended!');
    }
    await this.giveProduct(transfer.product.id, transfer.count);

    const cashier = await this.userService.getOne(userId);

    await this.transferRepository.update(id, { cashier, progres: 'Rejected', isChecked: true });
  }
}
