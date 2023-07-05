import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as XLSX from 'xlsx';

import { Excel } from './excel.entity';
import { delete_file, ExcelDataParser } from 'src/infra/helpers';
import { ValidateExcel } from 'src/infra/validators';
import { FileService } from '../file/file.service';
import { createWriteStream } from 'fs';
import { Repository } from 'typeorm';

Injectable();
export class ExcelService {
  constructor(
    @InjectRepository(Excel)
    private readonly excelRepository: Repository<Excel>,
    private readonly fileService: FileService,
  ) {}

  async uploadExecl(path: string, partiya: string) {
    const data = await this.ExcelToJson(path);
    await this.create(path, partiya);
    return data;
  }

  async ExcelToJson(path: string) {
    if (!path) return [];

    const workbook = XLSX.readFile(path);
    const worksheet = workbook.Sheets['Sheet'];

    const data: any[] = XLSX.utils.sheet_to_json(worksheet);

    ValidateExcel(data, path);

    return ExcelDataParser(await this.setImg(data));
  }

  async getPartiyaExcel(path: string) {
    if (!path) return [];

    const workbook = XLSX.readFile(path);
    const worksheet = workbook.Sheets['Sheet'];

    const data: any[] = XLSX.utils.sheet_to_json(worksheet);

    return ExcelDataParser(data);
  }

  async jsonToExcel(data, id: string) {
    const excel = await this.excelRepository.findOne({
      where: { partiya: { id } },
    });

    if (!excel || !excel?.path)
      throw new HttpException('data not found', HttpStatus.BAD_REQUEST);
    delete_file(excel.path);
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const stream = XLSX.stream.to_csv(workbook);
    stream.pipe(createWriteStream(excel.path));

    return excel.path;
  }

  async setImg(data) {
    const res = [];
    for (const item of data) {
      const img = await this.fileService.getByModelAndColor(
        item.Model,
        item.Color,
      );
      const Img = img?.url || '';
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
