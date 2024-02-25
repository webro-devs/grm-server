import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { DataSource, EntityManager, FindOptionsWhere, Repository } from 'typeorm';
import { CreateTransferDto, UpdateTransferDto } from './dto';

import { Transfer } from './transfer.entity';
import { ProductService } from '../product/product.service';
import { CreateProductDto } from '../product/dto';
import { UserService } from '../user/user.service';
import { ActionService } from '../action/action.service';
import { FilialService } from '../filial/filial.service';

Injectable();
export class TransferService {
  constructor(
    @InjectRepository(Transfer)
    private readonly transferRepository: Repository<Transfer>,
    private readonly productService: ProductService,
    private readonly userService: UserService,
    private readonly connection: DataSource,
    private readonly actionService: ActionService,
    private readonly filialService: FilialService,
  ) {}
  async getAll(options: IPaginationOptions, where?: FindOptionsWhere<Transfer>): Promise<Pagination<Transfer>> {
    console.log(where);

    return paginate<Transfer>(this.transferRepository, options, {
      relations: {
        from: true,
        to: true,
        transferer: true,
        product: { color: true, partiya: true, model: { collection: true }, filial: true },
      },
      order: { date: 'DESC' },
      where,
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
          product: { color: true, partiya: true, model: { collection: true } },
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
    let size = 0;
    if (values.length) {
      await Promise.all(
        values.map(async (value) => {
          size += (await this.takeSize(value.product, value.count)) || 0;
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
      const filial_1 = await this.filialService.getOne(values[0].from);
      const filial_2 = await this.filialService.getOne(values[0].to);
      await this.actionService.create({}, id, values[0].from, `С ${filial_1.title} на ${filial_2.title} м².`);
    }
  }

  async takeSize(id: string, count: number) {
    const product = await this.productService.getById(id);

    return product.x * product.y * count;
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
      count: transfer.count || 1,
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

    const res = await this.productService.create([newProduct]);

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
