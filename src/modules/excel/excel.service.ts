import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as XLSX from 'xlsx';

import { Excel } from './excel.entity';
import { deleteFile, excelDataParser } from 'src/infra/helpers';
import { FileService } from '../file/file.service';
import * as fs from 'fs';
import * as path from 'path';
import { Repository } from 'typeorm';
import { PartiyaService } from '../partiya/partiya.service';
import { ProductService } from '../product/product.service';

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
  async createExcelFile(datas, pathname) {
    const workbook = XLSX.utils.book_new();

    const worksheet = XLSX.utils.json_to_sheet(datas);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet');
    const filePath = path.join(__dirname, '..', '..', '..', '..', pathname);

    await fs.promises.writeFile(
      filePath,
      XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' }),
    );

    return pathname;
  }

  async readExcelFile(path) {
    const workbook = XLSX.readFile(path);
    const worksheet = workbook.Sheets['Sheet'];
    const data: any[] = XLSX.utils.sheet_to_json(worksheet);

    return data;
  }

  async updateExcelFile(datas: unknown[], pathName) {
    const workbook = XLSX.utils.book_new();
    const oldData: any[] = await this.readExcelFile(pathName);
    deleteFile(pathName);

    let data = [];
    data = oldData.length > 0 ? [...datas, ...oldData] : datas;

    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet');

    const filePath = path.join(__dirname, '..', '..', '..', '..', pathName);
    await fs.promises.writeFile(
      filePath,
      XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' }),
    );

    return datas;
  }

  async uploadFile(path) {
    const datas = await this.readExcelFile(path);
    deleteFile(path);
    return excelDataParser(this.setImg(datas));
  }

  async createProduct(partiya, datas: any[]) {
    const { data } = await this.partiyaService.getOne(partiya);
    for (let i = 0; i < datas.length; i++) {
      datas[i].otherImgs = JSON.stringify(datas[i].otherImgs);
      datas[i].otherInfos = JSON.stringify(datas[i].otherInfos);
    }

    const product = await this.productService.create(datas);
    const products = [];

    for (let i = 0; i < product.raw.length; i++) {
      let data = await this.productService.getOneForExcel(product.raw[i].raw);

      products.push({ ...data, ...JSON.parse(data.otherInfos) });
      delete products[i].otherInfos;
    }

    const updatedDatas = await this.updateExcelFile(products, data.excel.path);

    return updatedDatas;
  }

  async create(path, partiya) {
    const response = await this.excelRepository
      .createQueryBuilder()
      .insert()
      .into(Excel)
      .values({ path, partiya } as unknown as Excel)
      .returning('id')
      .execute();

    return response;
  }

  async setImg(data) {
    const res = [];
    for (const item of data) {
      if (!item.imgUrl) {
        const img1 = await this.fileService.getByModelAndColor(
          item.model,
          item.color,
        );
        const imgUrl = img1?.url || '';
        res.push({ ...item, imgUrl });
      } else res.push(item);
    }

    return res;
  }
}
