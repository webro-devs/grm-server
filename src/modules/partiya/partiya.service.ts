import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

import { Partiya } from './partiya.entity';
import { PartiyaRepository } from './partiya.repository';
import { CreatePartiyaDto, UpdatePartiyaDto } from './dto';
import { partiyaDateSort } from '../../infra/helpers';
import { ExcelService } from '../excel/excel.service';

Injectable();
export class PartiyaService {
  constructor(
    @InjectRepository(Partiya)
    private readonly partiyaRepository: PartiyaRepository,
    private readonly excelRepository: ExcelService,
  ) {}

  async getAll(
    options: IPaginationOptions,
  ): Promise<Pagination<Partiya>> {
    return paginate<Partiya>(this.partiyaRepository, options, {});
  }

  async getAllByDateRange() {
    const data = await this.partiyaRepository.find({ order: { date: 'DESC' } });
    const res = partiyaDateSort(data);
    return res;
  }

  async getOne(id: string) {
    const data = await this.partiyaRepository.findOne({
      where: { id },
      relations: {
        excel: true,
      },
    });

    const response = await this.excelRepository.gatPartiyaExcel(
      data.excel.path,
    );

    if (!data) throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    else if (response?.length < 1)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);

    return response;
  }

  async deleteOne(id: string) {
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
