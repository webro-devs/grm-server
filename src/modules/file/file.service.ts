import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as XLSX from 'xlsx';

import { FileEntity } from './file.entity';
import { FileRepository } from './file.repository';
import { ExcelDataValidation } from 'src/infra/validators';
import { ExcelDataParser } from 'src/infra/helpers';

Injectable();
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: FileRepository,
    private readonly excelDataValidation: ExcelDataValidation,
  ) {}
  async ExcelToJson(path: string) {
    const workbook = XLSX.readFile(path);
    const worksheet = workbook.Sheets['Sheet'];

    const data: any[] = XLSX.utils.sheet_to_json(worksheet);

    this.excelDataValidation.validate(data);

    return ExcelDataParser(data);
  }
}
