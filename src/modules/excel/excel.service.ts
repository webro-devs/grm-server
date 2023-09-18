import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as XLSX from 'xlsx';

import { Excel } from './excel.entity';
import { deleteFile, excelDataParser, jsonToSheet } from 'src/infra/helpers';
import { ValidateExcel } from 'src/infra/validators';
import { FileService } from '../file/file.service';
import * as fs from 'fs';
import * as path from 'path';
import { Repository } from 'typeorm';
import { PartiyaService } from '../partiya/partiya.service';
import { ProductService } from '../product/product.service';
import { CreateProductDto } from '../product/dto';

Injectable();
export class ExcelService {
  constructor(
    @InjectRepository(Excel)
    private readonly excelRepository: Repository<Excel>,
    private readonly fileService: FileService,
    @Inject(forwardRef(() => PartiyaService))
    private readonly partiyaService: PartiyaService,
    private readonly productService: ProductService,
  ) {}

  async uploadExecl(path: string, partiya: string) {
    const response = await this.partiyaService.getOne(partiya);
    if (response.items.length) {
      const oldData = await this.ExcelToJson(response.items[0].excel.path);
      const newData = await this.ExcelToJson(path);
      const updatedData = [...oldData, ...newData];
      const pathExcel = await this.jsonToExcel(
        updatedData,
        response.items[0].id,
      );
      deleteFile(path);
      console.log(pathExcel);
      await this.update(pathExcel, response.items[0].excel.id);
      return updatedData;
    } else {
      const data = await this.ExcelToJson(path);
      await this.create(path, partiya);
      return data;
    }
  }

  async ExcelToJson(path: string) {
    if (!path) return [];

    const workbook = XLSX.readFile(path);
    const worksheet = workbook.Sheets['Sheet'];
    const data: any[] = XLSX.utils.sheet_to_json(worksheet);

    ValidateExcel(data, path);

    return excelDataParser(await this.setImg(data));
  }

  async getPartiyaExcel(path: string) {
    if (!path) return [];

    const workbook = XLSX.readFile(path);
    const worksheet = workbook.Sheets['Sheet'];

    const data: any[] = XLSX.utils.sheet_to_json(worksheet);

    return excelDataParser(data);
  }

  async jsonToExcel(data, id: string) {
    const excel = await this.excelRepository.findOne({
      where: { partiya: { id } },
    });

    if (!excel || !excel?.path)
      throw new HttpException('Partiya not found', HttpStatus.BAD_REQUEST);

    deleteFile(excel.path);
    const workbook = XLSX.utils.book_new();

    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet');
    const filePath = path.join(__dirname, '..', '..', '..', '..', excel.path);

    // Write the workbook to the specified path
    await fs.promises.writeFile(
      filePath,
      XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' }),
    );
    this.create(`${excel.path}`, id);

    return excel.path;
  }

  async setImg(data) {
    const res = [];
    for (const item of data) {
      const img = await this.fileService.getByModelAndColor(
        item.model,
        item.color,
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

  async update(path: string, id: string) {
    const response = this.excelRepository.update({ id }, { path });

    return response;
  }

  async partiyaToBaza(partiyaId, datas: CreateProductDto) {
    // excel to json =>
    await this.jsonToExcel([datas], partiyaId);
    // const response = await this.productService.create([datas]);
    return 'response';
  }

  async datasToBaza(partiyaId, datas: CreateProductDto[]) {
    const data = await this.jsonToExcel(datas, partiyaId);
    const response = await this.productService.create(datas);
    return response;
  }
}
