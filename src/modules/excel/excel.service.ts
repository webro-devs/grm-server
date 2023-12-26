import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
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
import { CreateProductExcelDto } from './dto';
import { PlatteService } from '../platte/platte.service';

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
    private readonly platteService: PlatteService,
  ) {}
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

  async createExcelFile(datas, pathname) {
    const workbook = XLSX.utils.book_new();

    const worksheet = XLSX.utils.json_to_sheet(datas);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet');
    const filePath = path.join(process.cwd(), pathname);

    await fs.promises.writeFile(
      filePath,
      XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' }),
    );

    return pathname;
  }

  readExcel(path: string) {
    const workbook = XLSX.readFile(path);
    const worksheet = workbook.Sheets['Sheet'];
    const data: any[] = XLSX.utils.sheet_to_json(worksheet);

    return data;
  }

  async readProducts(partiyaId: string) {
    const partiya = await this.partiyaService.getOne(partiyaId);
    if (partiya && partiya?.excel) {
      const workbook = XLSX.readFile(partiya.excel.path);
      const worksheet = workbook.Sheets['Sheet'];
      let data: any[] = XLSX.utils.sheet_to_json(worksheet);
      data = this.setJson(data);

      return excelDataParser(data, partiya.expense);
    }
    throw new BadRequestException('Partiya not found!');
  }

  async addProductToPartiya(
    products: CreateProductExcelDto[],
    partiyaId: string,
  ) {
    const partiya = await this.partiyaService.getOne(partiyaId);
    if (partiya && partiya?.excel) {
      let data = [];
      const oldProducts = this.readExcel(partiya.excel.path);
      let maxId = this.getMaxId(oldProducts);
      for (const product of products) {
        data.push({ id: ++maxId, ...product });
      }
      data = await this.setModules(data, true);
      data = this.setString(data);
      let response = await this.updateExcelFile(partiya.excel.path, data);
      response = this.setJson(response);

      return excelDataParser(response, partiya.expense || 0);
    }
  }

  async createProduct(partiyaId) {
    const partiya = await this.partiyaService.getOne(partiyaId);
    if (partiya.check) {
      throw new BadRequestException('Partiya already sended to filials');
    }
    const productsBuffer = this.readExcel(partiya.excel.path);
    let products = this.setJson(productsBuffer);
    const filial = await this.filialService.findOrCreateFilialByTitle('baza');

    products = this.setProperty(products, filial.id);
    const response = await this.productService.create(products);
    await this.partiyaService.change({ check: true }, partiya.id);

    return response;
  }

  async updateProductsPartiya({ newData, partiyaId }) {
    const partiya = await this.partiyaService.getOne(partiyaId);
    let oldData = this.readExcel(partiya.excel.path);
    let updatedData = [...oldData];
    newData = await this.setModules(newData, true);
    newData = this.setString(newData);
    newData.forEach((newItem) => {
      const index = updatedData.findIndex((item) => item.id === newItem.id);
      if (index !== -1) {
        updatedData[index] = { ...updatedData[index], ...newItem };
      } else {
        throw new BadRequestException('Product not found');
      }
    });
    await this.updateExcelFile(partiya.excel.path, updatedData, true);
    updatedData = this.setJson(updatedData);

    return excelDataParser(updatedData, partiya.expense);
  }

  async updateExcelFile(pathName, newData, restrict: boolean = false) {
    const workbook = XLSX.utils.book_new();
    let oldData: any[] = [];
    restrict ? (oldData = []) : (oldData = this.readExcel(pathName));
    deleteFile(pathName);

    oldData = [...newData, ...oldData];
    const worksheet = XLSX.utils.json_to_sheet(oldData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet');

    const filePath = path.join(process.cwd(), pathName);
    await fs.promises.writeFile(
      filePath,
      XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' }),
    );

    return oldData;
  }

  // utils:
  getMaxId(oldProducts: Array<{ id: number }>) {
    let maxId = 0;
    if (oldProducts.length > 0) {
      for (const oldProduct of oldProducts) {
        maxId = maxId < oldProduct.id ? oldProduct.id : maxId;
      }
    }
    return maxId;
  }

  async setModules(datas, byId = false) {
    let data = [];
    const toggle = byId ? 'getOne' : 'getOneByName';
    data = await this.setCollection(datas, toggle);
    data = await this.setModel(data, toggle);
    data = await this.setColor(data, toggle);
    data = await this.setPalette(data, toggle);
    data = await this.setShape(data, toggle);
    data = await this.setStyle(data, toggle);
    data = await this.setSize(data, toggle);
    data = await this.setImg(data);

    return data;
  }

  setModulesUpdate(datas, byId = false) {
    const toggle = byId ? 'getOne' : 'getOneByName';

    const propertyToFunction = {
      model: this.setModel,
      collection: this.setCollection,
      color: this.setColor,
      palette: this.setPalette,
      shape: this.setShape,
      style: this.setStyle,
      size: this.setSize,
      imgUrl: this.setImg,
    };

    return Promise.all(
      datas.map((data) => {
        for (const [property, func] of Object.entries(propertyToFunction)) {
          if (data[property]) {
            data = func.call(this, data, toggle);
          }
        }
        return data;
      }),
    );
  }

  setString(products) {
    for (let product of products) {
      product.collection = JSON.stringify(product.collection);
      product.model = JSON.stringify(product.model);
      product.color = JSON.stringify(product.color);
      product.shape = JSON.stringify(product.shape);
      product.style = JSON.stringify(product.style);
      product.palette = JSON.stringify(product.palette);
      product.otherImgs = JSON.stringify(product.otherImgs || []);
      product.size = JSON.stringify(product.size);
    }
    return products;
  }

  setProperty(products, filialId) {
    for (let product of products) {
      delete product.collection;
      delete product.id;
      product.model = product.model.id;
      product.color = product.color.id;
      product.shape = product.shape.title;
      product.style = product.style.title;
      product.palette = product.palette.id;
      product.size = product.size.title;
      product.filial = filialId;
    }
    return products;
  }

  setStringUpdate(products) {
    for (let product of products) {
      if (product.collection)
        product.collection = JSON.stringify(product.collection);
      if (product.model) product.model = JSON.stringify(product.model);
      if (product.color) product.color = JSON.stringify(product.color);
      if (product.shape) product.shape = JSON.stringify(product.shape);
      if (product.style) product.style = JSON.stringify(product.style);
      if (product.palette) product.palette = JSON.stringify(product.palette);
      if (product.otherImgs)
        product.otherImgs = JSON.stringify(product.otherImgs);
      if (product.size) product.size = JSON.stringify(product.size);
    }
    return products;
  }

  setJson(products) {
    for (let product of products) {
      product.collection = JSON.parse(product.collection);
      product.model = JSON.parse(product.model);
      product.color = JSON.parse(product.color);
      product.shape = JSON.parse(product.shape);
      product.style = JSON.parse(product.style);
      product.palette = JSON.parse(product.palette);
      product.otherImgs = JSON.parse(product.otherImgs);
      product.size = JSON.parse(product.size);
    }
    return products;
  }

  async setCollection(data, toggle) {
    for (const item of data) {
      item.collection = (await this.collectionService[toggle](
        item.collection,
      )) || {
        id: '#',
        title: item.collection || 'пустой',
        coming: false,
        model: [],
      };
      if (item.collection.model.length < 1) {
        item.model = false;
      }
    }

    return data;
  }

  async setModel(data, toggle) {
    for (const item of data) {
      if (item.model) {
        item.model = await this.modelService[toggle](item.model);
        delete item.model.collection;
      } else {
        item.model = {
          id: '#',
          title: 'пустой',
          coming: false,
        };
      }
      item.collection?.model && delete item.collection.model;
    }
    return data;
  }

  async setColor(data, toggle) {
    for (const item of data) {
      item.color = (await this.colorService[toggle](item.color, true)) || {
        id: '#',
        title: item.color || 'пустой',
        code: '#',
        coming: false,
      };
    }

    return data;
  }

  async setPalette(data, toggle) {
    for (const item of data) {
      item.palette = (await this.platteService[toggle](item?.palette)) || {
        id: '#',
        title: item.palette || 'пустой',
        coming: false,
      };
    }

    return data;
  }

  async setShape(data, toggle) {
    for (const item of data) {
      item.shape = (await this.shapeService[toggle](item.shape)) || {
        id: '#',
        title: item.shape || 'пустой',
        coming: false,
      };
    }

    return data;
  }

  async setSize(data, toggle) {
    for (const item of data) {
      item.size = (await this.sizeService[toggle](item.size)) || {
        id: '#',
        title: 'пустой',
        coming: false,
      };
    }

    return data;
  }

  async setStyle(data, toggle) {
    for (const item of data) {
      item.style = (await this.styleService[toggle](item.style)) || {
        id: '#',
        title: 'пустой',
        coming: false,
      };
    }

    return data;
  }

  async setImg(data) {
    for (const item of data) {
      if (!item.imgUrl) {
        const model =
          item.model.id == '#'
            ? false
            : await this.modelService.getOne(item.model.id);
        const color =
          item.color.id == '#'
            ? false
            : (await this.colorService.getOne(item.color.id)) || {
                title: 'empty',
              };
        if (model && color) {
          data.imgUrl = await this.fileService.getByModelAndColor(
            model?.title,
            color?.title,
          );
        } else data.imgUrl = '0';
      }
    }

    return data;
  }
}
