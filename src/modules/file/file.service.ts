import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as XLSX from 'xlsx';

import { FileEntity } from './file.entity';
import { FileRepository } from './file.repository';
import { ExcelDataParser } from 'src/infra/helpers';
import { ValidateExcel } from 'src/infra/validators';

Injectable();
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: FileRepository,
  ) {}

  async ExcelToJson(path: string) {
    const workbook = XLSX.readFile(path);
    const worksheet = workbook.Sheets['Sheet'];

    const data: any[] = XLSX.utils.sheet_to_json(worksheet);

    ValidateExcel(data);

    return ExcelDataParser(data);
  }
}
