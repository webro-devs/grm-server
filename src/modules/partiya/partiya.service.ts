import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';

import { Partiya } from './partiya.entity';
import { CreatePartiyaDto, UpdatePartiyaDto } from './dto';
import { deleteFile, partiyaDateSort } from '../../infra/helpers';
import { ExcelService } from '../excel/excel.service';
import { Repository } from 'typeorm';

Injectable();
export class PartiyaService {
  constructor(
    @InjectRepository(Partiya)
    private readonly partiyaRepository: Repository<Partiya>,
    private readonly excelService: ExcelService,
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
        relations: {},
      })
      .catch(() => {
        throw new NotFoundException('Partiya not found!');
      });

    return data;
  }

  async getOneProds(id: string) {
    const data = await this.partiyaRepository
      .findOne({
        where: { id },
        relations: {
          productsExcel: {
            collection: true,
            model: true,
            color: true,
            size: true,
            shape: true,
            style: true,
          },
        },
      })
      .catch(() => {
        throw new NotFoundException('data not found');
      });

    return data;
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

  async create(value: CreatePartiyaDto) {
    const data = this.partiyaRepository.create(value);
    return await this.partiyaRepository.save(data);
  }

  // utils:
  async processInputData(input) {
    // await input.items.forEach(async (item, index) => {
    //   try {
    //     const processedItem = await this.processItem(item);

    //     const calc = this.allcalculateTotals(processedItem.excel);
    //     delete processedItem.excel;
    //     processedItem['price'] = calc.totalM2 * calc.collectionPrice || 0;
    //     processedItem['m2'] = calc.totalM2 || 0;
    //     processedItem['commingPrice'] = processedItem['price'] / calc.totalM2 || 0;
    //     console.log('processed item===>', processedItem);
    //     item = processedItem;
    //     console.log(`\input item i:${index}===> `, item);
    //   } catch (error) {
    //     console.error(`Error processing item: ${error.message}`);
    //   }
    // });
    const data = [];
    for (let i = 0; i < input.items.length; i++) {
      const element = input.items[i];
      const processedItem = await this.processItem(element);
      const calc = this.allcalculateTotals(processedItem.excel) || { totalM2: 0, collectionPrice: 0 };
      delete input.items[i].excel;
      input.items[i].price = calc?.totalM2 * calc?.collectionPrice || 0;
      input.items[i].m2 = calc?.totalM2 || 0;
    }
    console.log(data);

    return input;
  }

  allcalculateTotals(data) {
    return data.reduce(
      (totals, currentItem) => {
        totals.totalM2 += (eval(currentItem.size.title.match(/\d+\.*\d*/g).join('*')) / 10000) * currentItem.count;
        totals.collectionPrice = currentItem.collectionPrice;
        return totals;
      },
      { totalM2: 0, collectionPrice: 0 },
    );
  }

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
