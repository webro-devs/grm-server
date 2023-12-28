import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

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
        relations: {
          excel: true,
        },
      })
      .catch(() => {
        throw new NotFoundException('data not found');
      });

    const response = this.excelService.readExcel(data?.excel?.path);

    return {
      ...data,
      items: response,
    };
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

  async createPartiyaWithExcel(value: CreatePartiyaDto) {
    const data = await this.create(value);
    const filename = `uploads/excel/excel_${Date.now()}.xlsx`;

    await this.excelService.createExcelFile([], filename);

    await this.excelService.create(`${filename}`, data.id);

    return data;
  }

  // utils:
  async processInputData(input) {
    input.items.forEach(async (item, index) => {
      try {
        const processedItem = this.processItem(item);
        const calc = this.calculateTotals(processedItem.excel);
        delete processedItem.excel;
        processedItem['price'] =
          calc.totalM2 * calc.commingPrice - processedItem.expense || 0;
        processedItem['m2'] = calc.totalM2 || 0;
        processedItem['commingPrice'] =
          processedItem['price'] / calc.totalM2 || 0;

        input.items[index] = processedItem;
      } catch (error) {
        console.error(`Error processing item: ${error.message}`);
      }
    });

    return input;
  }

  calculateTotals(data) {
    return data.reduce(
      (totals, currentItem) => {
        totals.totalM2 +=
          (eval(currentItem.size.title.match(/\d+\.*\d*/g).join('*')) / 10000) *
          currentItem.count;
        totals.commingPrice = currentItem.commingPrice;
        return totals;
      },
      { totalM2: 0, commingPrice: 0 },
    );
  }

  processItem(item) {
    try {
      const excelData = this.excelService.readExcel(item.excel.path);
      return {
        ...item,
        excel: this.excelService.setJson(excelData),
      };
    } catch (error) {
      console.error(`Error processing ${item.excel}: ${error.message}`);
      return { ...item, excel: [] };
    }
  }
}
