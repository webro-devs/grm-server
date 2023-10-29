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
import { CollectionService } from '../collection/collection.service';
import { ColorService } from '../color/color.service';
import { ModelService } from '../model/model.service';
import { ShapeService } from '../shape/shape.service';
import { SizeService } from '../size/size.service';
import { StyleService } from '../style/style.service';
import { FilialService } from '../filial/filial.service';

Injectable();
export class ExcelService {
  constructor(
    @InjectRepository(Excel)
    private readonly excelRepository: Repository<Excel>,
    private readonly fileService: FileService,
    @Inject(forwardRef(() => PartiyaService))
    private readonly partiyaService: PartiyaService,
    private readonly productService: ProductService,
    private readonly collectionService: CollectionService,
    private readonly colorService: ColorService,
    private readonly modelService: ModelService,
    private readonly shapeService: ShapeService,
    private readonly sizeService: SizeService,
    private readonly styleService: StyleService,
    private readonly filialService: FilialService,
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

  async updateExcelFile(newData, pathName, restrict: boolean = false) {
    const workbook = XLSX.utils.book_new();
    let oldData: any[] = [];
    restrict ? (oldData = []) : (oldData = await this.readExcelFile(pathName));
    deleteFile(pathName);

    for (let i = 0; i < newData.length; i++) {
      const newItem = newData[i];
      const idToCheck = newItem.id;

      const indexToUpdate = oldData.findIndex((item) => item.id == idToCheck);

      if (indexToUpdate !== -1) {
        oldData[indexToUpdate] = { ...oldData[indexToUpdate], ...newItem };
        newData.splice(idToCheck, 1);
      }
    }

    oldData = [...newData, ...oldData];
    const worksheet = XLSX.utils.json_to_sheet(oldData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet');

    const filePath = path.join(__dirname, '..', '..', '..', '..', pathName);
    await fs.promises.writeFile(
      filePath,
      XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' }),
    );

    return oldData;
  }

  async uploadFile(path) {
    const datas = await this.readExcelFile(path);
    deleteFile(path);
    return excelDataParser(datas);
  }

  async createProduct(
    partiya,
    datas: any[],
    toDataBase: boolean = false,
    reSaveExcel: boolean = true,
    isNew: boolean = true,
  ) {
    const { excel, expense } = await this.partiyaService.getOne(partiya);
    if (toDataBase) {
      const excelDatas = await this.readExcelFile(excel.path);
      for (const excelData of excelDatas) {
        datas.push({
          ...excelData,
          model: JSON.parse(excelData.model).id,
          color: JSON.parse(excelData.color).id,
          style: JSON.parse(excelData.style).title,
          size: JSON.parse(excelData.size).title,
          shape: JSON.parse(excelData.color).title,
        });
      }

      for (let i = 0; i < datas.length; i++) {
        datas[i].otherImgs =
          typeof datas[i].otherImgs == 'string'
            ? datas[i].otherImgs
            : JSON.stringify(datas[i].otherImgs);
      }

      const productIds = await this.productService.updateOrCreateProducts(
        datas,
      );

      let products = [];
      let updatedDatas = [];

      if (reSaveExcel) {
        for (let i = 0; i < productIds.length; i++) {
          let data = await this.productService.getOneForExcel(productIds[i]);

          products.push({
            ...data,
            model: JSON.stringify(datas[i].model),
            color: JSON.stringify(datas[i].color),
            shape: JSON.stringify(datas[i].shape),
            size: JSON.stringify(datas[i].size),
            style: JSON.stringify(datas[i].style),
            filial: datas[i].filial.id,
          });
        }
        updatedDatas = await this.updateExcelFile(products, excel.path, true);
        products = [];
      }

      return { updatedDatas, expense };
    } else {
      let products = [];
      const excelDatas = await this.readExcelFile(excel.path);
      let maxAge =
        excelDatas.reduce(
          (max, obj) => (+obj.id > +max.id ? obj : max),
          excelDatas[0],
        )?.id || 0;

      for (let i = 0; i < datas.length; i++) {
        products.push({
          ...datas[i],
          id: datas[i]?.id || ++maxAge,
          model: JSON.stringify(datas[i].model),
          color: JSON.stringify(datas[i].color),
          shape: JSON.stringify(datas[i].shape),
          size: JSON.stringify(datas[i].size),
          style: JSON.stringify(datas[i].style),
          otherImgs: JSON.stringify(datas[i].otherImgs),
        });
      }
      const updatedDatas = await this.updateExcelFile(products, excel.path);

      return { updatedDatas: isNew ? updatedDatas : products, expense };
    }
  }

  async updateProduct(datas, partiyaId) {
    const { excel } = await this.partiyaService.getOne(partiyaId);
    const excelData = await this.readExcelFile(excel.path);

    for (let i = 0; i < datas.length; i++) {
      for (let ind = 0; ind < excelData.length; ind++) {
        if (datas[i].id == excelData[ind].id) {
          excelData[ind] = { ...excelData[ind], ...datas[i] };

          excelData[ind].filial =
            typeof excelData[ind].filial == 'string'
              ? excelData[ind].filial
              : JSON.stringify(excelData[ind].filial);

          excelData[ind].style =
            typeof excelData[ind].style == 'string'
              ? excelData[ind].style
              : JSON.stringify(excelData[ind].style);

          excelData[ind].size =
            typeof excelData[ind].size == 'string'
              ? excelData[ind].size
              : JSON.stringify(excelData[ind].size);

          excelData[ind].shape =
            typeof excelData[ind].shape == 'string'
              ? excelData[ind].shape
              : JSON.stringify(excelData[ind].shape);

          excelData[ind].model =
            typeof excelData[ind].model == 'string'
              ? excelData[ind].model
              : JSON.stringify(excelData[ind].model);

          excelData[ind].color =
            typeof excelData[ind].color == 'string'
              ? excelData[ind].color
              : JSON.stringify(excelData[ind].color);
        }
      }
    }

    return await this.updateExcelFile(excelData, excel.path, true);
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

  async setModules(datas, byId = false) {
    let data = [];
    const toggle = byId ? 'getOne' : 'getOneByName';
    data = await this.setCollection(datas, toggle);
    data = await this.setModel(data, toggle);
    data = await this.setColor(data, toggle);
    data = await this.setShape(data);
    data = await this.setSize(data);
    data = await this.setStyle(data);
    data = await this.setImg(data);

    for (const product of data) {
      product.model.collection = product.collection;
      delete product.collection;
    }

    return data;
  }

  async setCollection(data, toggle) {
    const res = [];
    for (const item of data) {
      const collection = (await this.collectionService[toggle](
        item.collection || '#no',
      )) || {
        id: '#',
        title: item.collection,
        coming: false,
      };
      delete collection.model;
      res.push({ ...item, collection });
    }

    return res;
  }

  async setModel(data, toggle) {
    const res = [];
    for (const item of data) {
      let model = (await this.modelService[toggle](item.model)) || {
        id: '#',
        title: item.model,
        coming: false,
      };

      delete model.collection;
      item.model = model;
      res.push(item);
    }

    return res;
  }

  async setColor(data, toggle) {
    const res = [];
    for (const item of data) {
      const color = (await this.colorService[toggle](item.color)) || {
        id: '#',
        title: item.color,
        code: '#',
        coming: false,
      };
      res.push({ ...item, color });
    }

    return res;
  }

  async setShape(data) {
    const res = [];
    for (const item of data) {
      const shape = (await this.shapeService.getOneByName(item.shape)) || {
        id: '#',
        title: item.shape,
        coming: false,
      };
      item.shape = shape;
      res.push(item);
    }

    return res;
  }

  async setSize(data) {
    const res = [];
    for (const item of data) {
      const size = (await this.sizeService.getOneByName(item.size)) || {
        id: '#',
        title: item.size,
        coming: false,
      };
      res.push({ ...item, size });
    }

    return res;
  }

  async setStyle(data) {
    const res = [];
    for (const item of data) {
      const style = (await this.styleService.getOneByName(item.style)) || {
        id: '#',
        title: item.style,
        coming: false,
      };
      res.push({ ...item, style });
    }

    return res;
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
