import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';

import { Partiya } from './partiya.entity';
import { CreatePartiyaDto, UpdatePartiyaDto } from './dto';
import { deleteFile, partiyaDateSort } from '../../infra/helpers';
import { ExcelService } from '../excel/excel.service';
import { ILike, Repository } from 'typeorm';
import { ActionService } from '../action/action.service';

Injectable();
export class PartiyaService {
  constructor(
    @InjectRepository(Partiya)
    private readonly partiyaRepository: Repository<Partiya>,
    private readonly excelService: ExcelService,
    private readonly actionService: ActionService,
  ) {}

  async getAll(options: IPaginationOptions): Promise<Pagination<Partiya>> {
    const partiya = await paginate<Partiya>(this.partiyaRepository, options, {
      relations: {
        excel: true,
      },
      order: { date: 'DESC' },
    });

    const response = await this.processInputData(partiya);
    //@ts-ignore
    return response;
  }

  async getAllByDateRange() {
    const data = await this.partiyaRepository.find({ order: { date: 'DESC' } });
    const res = partiyaDateSort(data);
    return res;
  }

  async getOne(id: string) {
    const data = await this.partiyaRepository
      .findOne({
        where: { id },
        relations: { excel: true },
      })
      .catch(() => {
        throw new NotFoundException('Partiya not found!');
      });

    return (await this.processInputData({ items: [data] })).items[0];
  }

  async getOneProds(id: string, search: string | boolean = false) {
    return await this.partiyaRepository
      .findOne({
        relations: {
          productsExcel: {
            collection: true,
            model: { collection: true },
            color: true,
            size: true,
            shape: true,
            style: true,
          },
        },
        where: { id, ...(search && { productsExcel: { model: { collection: { title: ILike(`%${search}%`) } } } }) },
      })
      .catch(() => {
        throw new NotFoundException('data not found');
      });
  }

  async deleteOne(id: string) {
    const data = await this.partiyaRepository
      .findOne({
        where: { id },
        relations: { excel: true },
      })
      .catch(() => {
        throw new NotFoundException('Partiya not found');
      });

    deleteFile(data?.excel?.path);

    const response = await this.partiyaRepository.delete(id);
    return response;
  }

  async change(value: UpdatePartiyaDto, id: string) {

    const response = await this.partiyaRepository.update({ id }, value);
    return response;
  }

  async changeExp(value, id: string, user) {
    const response = await this.partiyaRepository.update({ id }, { expense: value });
    const partiya = await this.partiyaRepository.findOne({ where: { id } });
    await this.actionService.create(partiya, user.id, null, 'update_partiya', `${partiya.title}. $${partiya.expense}`);
    return response;
  }

  async create(value: CreatePartiyaDto, user) {
    await this.actionService.create(value, user.id, null, 'partiya_create');
    const data = this.partiyaRepository.create(value);
    return await this.partiyaRepository.save(data);
  }

  // utils:
  async processInputData(input) {
    const data = [];
    for (let i = 0; i < input.items.length; i++) {
      const element = input.items[i];
      const processedItem = await this.processItem(element);

      const calc = this.allcalculateTotals(processedItem.excel) || { m2: 0, price: 0 };

      delete input.items[i].excel;
      input.items[i].price = calc?.price || 0;
      input.items[i].m2 = calc?.m2 || 0;
    }

    return input;
  }

  allcalculateTotals(products) {
    const collections = {};

    products.forEach((product, i) => {
      const { size, collection, collectionPrice, priceMeter } = product;
      if (/^0\d*\./.test(size?.title)) {
        console.log('error: ', size.title);
        return new BadRequestException(`error: ${size?.title}`);
      }
      const totalM2 = (eval(size?.title.match(/\d+\.*\d*/g).join('*') || [0, 0]) / 10000 || 0) * product?.count;

      if (!collections[collection?.title]) {
        collections[collection?.title] = {
          totalM2: 0,
          collectionPrice: collectionPrice,
        };
      }

      collections[collection?.title].totalM2 += totalM2;
    });

    const totalPricesByCollection = Object.entries(collections).map(([collection, data]) => {
      const totalPrice = data['totalM2'] * data['collectionPrice'];
      return { price: totalPrice || 0, m2: data['totalM2'] };
    });
    const partiya = totalPricesByCollection.reduce(
      (pre, curr) => {
        return { m2: pre.m2 + curr.m2, price: pre.price + curr.price };
      },
      { m2: 0, price: 0 },
    );

    return partiya;
  }

  // totals.totalM2 += (eval(currentItem.size.title.match(/\d+\.*\d*/g).join('*')) / 10000) * currentItem.count;
  async processItem(item) {
    try {
      const excelData = await this.getOneProds(item.id);
      return {
        ...item,
        excel: excelData.productsExcel,
        price: 0,
        m2: 0,
        commingPrice: 0,
      };
    } catch (error) {
      console.error(`Error processing ${item.excel}: ${error.message}`);
      return { ...item, excel: [], price: 0, m2: 0, commingPrice: 0 };
    }
  }
}
