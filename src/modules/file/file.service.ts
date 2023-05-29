import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as XLSX from 'xlsx';

import { FileEntity } from './file.entity';
import { FileRepository } from './file.repository';
import { ExcelDataParser } from 'src/infra/helpers';

Injectable();
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: FileRepository,
  ) {}

  private message: {
    error: boolean;
    msg: string[];
    missingProps: string[];
    missingCells: string[];
  } = {
    error: false,
    msg: [],
    missingProps: [],
    missingCells: [],
  };
  private data;

  public validate(data) {
    this.message = {
      error: false,
      msg: [],
      missingProps: [],
      missingCells: [],
    };
    this.data = data;
    this.checkProperties(this.data);
    this.checkType(this.data);
    this.checkValue(this.data);
    this.restoreErrors();
    return this.message;
  }

  private checkProperties(data) {
    for (const item of data) {
      const properties = Object.keys(item);
      const expectedProperties = [
        'Collection',
        'Model',
        'Color',
        'Shape',
        'Style',
        'Size',
        'Code',
        'Count',
        'M2',
      ];

      if (properties.length < 9)
        this.message.msg.push('You have missing propery!');
      else if (properties.length > 9)
        this.message.msg.push('You have Unexpected property!');

      this.message.missingProps.push(
        ...expectedProperties.filter((item) => !properties.includes(item)),
      );
    }
  }
  private checkType(data) {
    for (const item of data) {
      if (isNaN(item.Count)) {
        this.message.msg.push('Count should be a number.');
      } else {
        item.Count = item.Count * 1;
      }
    }
  }

  private checkValue(data) {
    const alphabet = 'ABCDEFGHIJKLMOPQRSTUVWXYZ';
    const expectedProperties = [
      'Collection',
      'Model',
      'Color',
      'Shape',
      'Style',
      'Size',
      'Code',
      'Count',
      'M2',
    ];

    data.forEach((item, index) => {
      const properties = Object.keys(item);

      expectedProperties.forEach((el, i) => {
        if (!properties.includes(el)) {
          const cell = `${index + 1}:${alphabet[i]}`;
          this.message.missingCells.push(cell);
        }
      });
    });
  }

  private restoreErrors() {
    this.message.missingProps = [...new Set(this.message.missingProps)];
    this.message.msg = [...new Set(this.message.msg)];
    if (
      this.message.missingProps.length > 0 ||
      this.message.msg.length > 0 ||
      this.message.missingCells.length > 0
    )
      this.message.error = true;

    if (this.message.error)
      throw new HttpException(this.message, HttpStatus.BAD_REQUEST);
  }

  async ExcelToJson(path: string) {
    const workbook = XLSX.readFile(path);
    const worksheet = workbook.Sheets['Sheet'];

    const data: any[] = XLSX.utils.sheet_to_json(worksheet);

    this.validate(data);

    return ExcelDataParser(data);
  }
}
