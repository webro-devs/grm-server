import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as XLSX from 'xlsx';

import { Excel } from './excel.entity';
import { ExcelRepository } from './excel.repository';
import { ExcelDataParser } from 'src/infra/helpers';
import { ValidateExcel } from 'src/infra/validators';
import { FileService } from '../file/file.service';

Injectable();
export class ExcelService {
  constructor(
    @InjectRepository(Excel)
    private readonly excelRepository: ExcelRepository,
    private readonly fileService: FileService,
  ) {}

  async uploadExecl(path: string, partiya: string) {
    const data = await this.ExcelToJson(path);
    await this.create(path, partiya);
    return data;
  }

  async ExcelToJson(path: string) {
    const workbook = XLSX.readFile(path);
    const worksheet = workbook.Sheets['Sheet'];

    const data: any[] = XLSX.utils.sheet_to_json(worksheet);

    ValidateExcel(data, path);

    return ExcelDataParser(await this.setImg(data));
  }

  async setImg(data) {
    const res = [];
    for (const item of data) {
      const img = await this.fileService.getByModelAndColor(
        item.Model,
        item.Color,
      );
      const Img = img?.url || null;
      res.push({ ...item, Img });
    }

    return res;
  }

  async create(path: string, partiya: string) {
    const response = this.ExcelToJson(path);

    this.excelRepository
      .createQueryBuilder()
      .insert()
      .into(Excel)
      .values({ path, partiya } as unknown as Excel)
      .returning('id')
      .execute();

    return response;
  }
}
