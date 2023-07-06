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
    private readonly excelRepository: ExcelService,
  ) {}

  async getAll(options: IPaginationOptions): Promise<Pagination<Partiya>> {
    return paginate<Partiya>(this.partiyaRepository, options, {});
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

    const response = await this.excelRepository.getPartiyaExcel(
      data?.excel?.path,
    );

    return { data, items: response };
  }

  async deleteOne(id: string) {
    const data = await this.partiyaRepository
      .findOne({
        where: { id },
        relations: { excel: true },
      })
      .catch(() => {
        throw new NotFoundException('data not found');
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
}
