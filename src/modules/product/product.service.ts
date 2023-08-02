import { Injectable, NotFoundException, OnModuleDestroy } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as cron from 'node-cron';
import { FindOptionsWhere, Repository } from 'typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { Product } from './product.entity';
import {
  CreateProductDto,
  UpdateMagazinProductDto,
  UpdateProductDto,
} from './dto';
import { sizeParser } from 'src/infra/helpers';
import { FilialService } from '../filial/filial.service';

Injectable();
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly filialService: FilialService,
    private scheduledJobs: cron.ScheduledTask[] = [],
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

  async getAllInInternetShop(
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
    const data = await this.productRepository
      .findOne({
        where: { id },
        relations: {
          model: {
            collection: true,
          },
        },
      })
      .catch(() => {
        throw new NotFoundException('data not found');
      });

    return data;
  }

  async getMoreByIds(ids: string[]) {
    const data = await this.productRepository
      .createQueryBuilder()
      .where('id IN(:...ids)', { ids })
      .getMany();
    return data;
  }

  async deleteOne(id: string) {
    const response = await this.productRepository.delete(id).catch(() => {
      throw new NotFoundException('data not found');
    });
    return response;
  }

  async changeIsInternetShop(ids: string, isInternetShop: boolean) {
    const response = await this.productRepository
      .createQueryBuilder()
      .update()
      .set({ isInternetShop })
      .where('id IN(:...ids)', { ids })
      .execute();

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

  async changeMagazinProduct(value: UpdateMagazinProductDto, id: string) {
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

  async telegramOnOrOff(
    startTime = '09:00',
    endTime = '21:00',
    postPerTime = 1,
    onOff = 0,
  ) {
    if (onOff) {
      this.scheduledJobs.forEach((job) => job.stop());
      return;
    }

    const getTimeInMinutes = (time: string): number => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const sendData = (): void => {
      // Send the data goes here
      console.log('Sending data');
    };

    const intervalMinutes = 60 / postPerTime;

    // Convert start and end time to minutes from midnight
    const startMinutes = getTimeInMinutes(startTime);
    const endMinutes = getTimeInMinutes(endTime);

    // Schedule the data sending task
    for (
      let minutes = startMinutes;
      minutes < endMinutes;
      minutes += intervalMinutes
    ) {
      const hour = Math.floor(minutes / 60);
      const minute = minutes % 60;
      const cronExpression = `${minute} ${hour} * * *`; // Minutes Hours * * *
      const job = cron.schedule(cronExpression, () => sendData());
      this.scheduledJobs.push(job);
    }
  }
}
