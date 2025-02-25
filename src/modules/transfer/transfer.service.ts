import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { DataSource, EntityManager, Equal, FindOptionsWhere, Repository } from 'typeorm';
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
  ) {
  }

  async getAll(
    options: IPaginationOptions,
    where?: FindOptionsWhere<Transfer & { to: string, from: string, type: string, filial: any, }>,
    user?): Promise<Pagination<Transfer>> {
    const baza = await this.filialService.findOrCreateFilialByTitle('baza');
    if (!user?.filial) {
      user.filial = baza;
    }

    if (where.type == 'In') {
      where.to = Equal(user.filial.id);
      where?.filial && (where.from = Equal(where.filial));
    } else if (where.type == 'Out') {
      where.from = Equal(user.filial.id);
      where?.filial && (where.to = Equal(where.filial));
    }

    where?.type && delete where?.type;
    where?.filial && delete where?.filial;

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
          const prod = await this.productService.getOne(value.product);
          if (prod.count > 0 && prod.y > 0.3) {
            size += (await this.takeSize(value.product, value.count)) || 0;
            await this.takeProduct(value.product, value.count);
            await this.transferRepository
              .createQueryBuilder()
              .insert()
              .into(Transfer)
              .values({ ...value, transferer: id } as unknown as Transfer)
              .returning('id')
              .execute();
          }
        }),
      );
      const filial_1 = await this.filialService.getOne(values[0].from);
      const filial_2 = await this.filialService.getOne(values[0].to);
      await this.actionService.create(
        {},
        id,
        values[0].from,
        'transfer_create',
        `С ${filial_1.title} на ${filial_2.title} | ${Number(size).toFixed(2)} м².`,
      );
    }
  }

  async takeSize(id: string, count: number) {
    const product = await this.productService.getById(id);
    if (product.shape.toLowerCase().trim() === 'rulo') {
      return product.x * count / 100;
    }
    return product.x * product.y * count;
  }

  async takeProduct(id: string, count: number) {
    const product = await this.productService.getById(id);

    if (product.shape.toLowerCase() === 'rulo') {
      count /= 100;
      if (product.y < count) {
        throw new HttpException('Not enough meter product', HttpStatus.BAD_REQUEST);
      }
      product.y -= count;
    } else {
      if (count > product.count) {
        throw new HttpException('Not enough product', HttpStatus.BAD_REQUEST);
      }
      product.count -= count;
    }


    product.setTotalSize();
    await this.connection.transaction(async (manager: EntityManager) => {
      await manager.save(product);
    });
  }

  async giveProduct(id: string, count: number) {
    const product = await this.productService.getById(id);

    if (product.shape.toLowerCase() === 'rulo') {
      count /= 100;
      product.y += count;
    } else {
      product.count += count;
    }

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
      throw new BadRequestException('Transfer already checked!');
    }

    const product = transfer.product;
    const newProduct: CreateProductDto = {
      code: product?.code || null,
      color: product?.color?.id || null,
      count: product.shape.toLowerCase() === 'rulo' ? product.count : transfer.count || 1,
      filial: transfer.to.id,
      imgUrl: product.imgUrl,
      model: product?.model.id,
      price: product.price,
      comingPrice: product.comingPrice,
      priceMeter: product.priceMeter,
      shape: product?.shape,
      size: product?.size,
      style: product?.style,
      otherImgs: product.otherImgs,
      totalSize: product.x * product.y * transfer.count,
      x: product.x,
      y: product.shape.toLowerCase() === 'rulo' ? transfer.count / 100 : product.y,
      partiya: product.partiya.id,
      secondPrice: product?.secondPrice,
      country: product?.country,
    };

    const res = await this.productService.create([newProduct], true);

    const cashier = await this.userService.getOne(userId);

    await this.transferRepository.update(id, { cashier, progres: 'Accepted', isChecked: true });

    await this.actionService.create({
      ...transfer,
      progres: 'Accepted',
    }, cashier.id, cashier.filial.id, 'transfer_accept');

    return 'Ok';
  }

  async rejectProduct(id: string, userId: string) {
    const transfer = await this.transferRepository.findOne({ where: { id }, relations: { product: { filial: true } } });
    if (transfer.isChecked) {
      throw new BadRequestException('Transfer already ended!');
    }
    await this.giveProduct(transfer.product.id, transfer.count);

    const cashier = await this.userService.getOne(userId);

    await this.transferRepository.update(id, { cashier, progres: 'Rejected', isChecked: true });

    await this.actionService.create({
      ...transfer,
      progres: 'Rejected',
    }, cashier?.id, cashier?.filial?.id || transfer.product.filial.id, 'transfer_reject');
  }

  async checkTransferManager(id: string, userId: string) {
    const transfer = await this.transferRepository.findOne({
      where: { id },
      relations: { product: { color: true, model: true, partiya: true }, transferer: true, to: true },
    });
    if (transfer.isChecked) {
      throw new BadRequestException('Transfer already checked!');
    }

    const product = transfer.product;
    const newProduct: CreateProductDto = {
      code: product?.code || null,
      color: product?.color?.id || null,
      count: product.shape.toLowerCase() === 'rulo' ? product.count : transfer.count || 1,
      filial: transfer.to.id,
      imgUrl: product.imgUrl,
      model: product?.model.id,
      price: product.price,
      comingPrice: product.comingPrice,
      priceMeter: product.priceMeter,
      shape: product?.shape,
      size: product?.size,
      style: product?.style,
      otherImgs: product.otherImgs,
      totalSize: product.x * product.y * transfer.count,
      x: product.x,
      y: product.shape.toLowerCase() === 'rulo' ? transfer.count / 100 : product.y,
      partiya: product.partiya.id,
      secondPrice: product?.secondPrice,
      country: product?.country,
    };

    const res = await this.productService.create4Manager(newProduct, true);

    const cashier = await this.userService.getOne(userId);

    await this.transferRepository.update(id, { cashier, progres: 'Accepted', isChecked: true });

    await this.actionService.create({
      ...transfer,
      progres: 'Accepted',
    }, cashier.id, cashier.filial.id, 'transfer_accept');

    console.log('transer res =>: ', res);
    return res.raw[0].id;
  }
}
