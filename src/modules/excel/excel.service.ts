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

  async readProductsByModel(partiyaId: string, id: string) {
    const partiya = await this.partiyaService.getOne(partiyaId);
    if (partiya && partiya?.excel) {
      const workbook = XLSX.readFile(partiya.excel.path);
      const worksheet = workbook.Sheets['Sheet'];
      let data: any[] = XLSX.utils.sheet_to_json(worksheet);
      data = this.setJson(data);
      data = data.filter(e => e.model.id == id);

      if (data.length < 1) {
        throw new BadRequestException("Model not found!")
      }

      return excelDataParser(data, partiya.expense)[0];
    }
    throw new BadRequestException('Partiya not found!');
  }

  async addProductToPartiya(
    products: CreateProductExcelDto[],
    partiyaId: string,
  ) {
    const partiya = await this.partiyaService.getOne(partiyaId);
    const path = partiya.excel.path;
    const oldProducts = this.readExcel(path);
    let maxId = this.getMaxId(oldProducts);
    products.forEach((e, i) => {
      const product = this.findProduct(
        e.collection.indexOf,
        e.model.indexOf,
        path,
      );
      if (product) {
        products[i].collectionPrice = product['collectionPrice'];
        products[i].displayPrice = product['priceMeter'];
        products[i].priceMeter = product['priceMeter'];
      } else {
        products[i].collectionPrice = 0;
        products[i].priceMeter = 0;
        products[i].displayPrice = 0;
      }
    });

    products = products.map((e) => ({ ...e, isEdited: false, secondPrice: 0 }));
    products = this.setString(await this.setModules(products, true));
    products = this.setId(maxId, products);
    products = this.setJson(await this.updateExcelFile(path, products));
    return excelDataParser(products, partiya.expense);
  }

  async addProductIfNotExist(
    products: CreateProductExcelDto[],
    partiyaId: string,
  ) {
    const partiya = await this.partiyaService.getOne(partiyaId);
    const oldDatas = this.setJson(this.readExcel(partiya.excel.path));

    products = await this.setModules(products);
    const totalM2 =
      oldDatas.reduce(
        (total, obj) =>
          total +
          (eval(obj.size['title'].match(/\d+\.*\d*/g).join('*')) / 10000) *
            obj.count,
        0,
      ) +
      oldDatas.reduce(
        (total, obj) =>
          total +
          (eval(obj.size['title'].match(/\d+\.*\d*/g).join('*')) / 10000) *
            obj.count,
        0,
      );
  }

  async createProduct(partiyaId) {
    const partiya = await this.partiyaService.getOne(partiyaId);
    if (partiya.check) {
      throw new BadRequestException('Partiya already sended to filials');
    }
    const productsBuffer = this.readExcel(partiya.excel.path);
    let products = this.setJson(productsBuffer);
    products = this.setPrice(products, partiya.expense);
    console.log(JSON.stringify(products, null, 4));

    const filial = await this.filialService.findOrCreateFilialByTitle('baza');

    products = this.setProperty(products, filial.id, partiya.country);
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
        updatedData[index] = { ...updatedData[index], ...newItem, isEdited: true };
      } else {
        throw new BadRequestException('Product not found');
      }
    });
    await this.updateExcelFile(partiya.excel.path, updatedData, true);

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

  async updateCollectionCost(partiyaId, collectionId, cost) {
    const partiya = await this.partiyaService.getOne(partiyaId);
    const products = this.setJson(this.readExcel(partiya.excel.path));
    products.forEach((product, index) => {
      if (product.collection.id == collectionId) {
        products[index].collectionPrice = cost;
      }
    });
    this.updateExcelFile(partiya.excel.path, this.setString(products), true);

    return 'product updated!';
  }

  async updateModelCost(partiyaId, modelId, cost) {
    const partiya = await this.partiyaService.getOne(partiyaId);
    const products = this.setJson(this.readExcel(partiya.excel.path));
    console.log(products);
    
    products.forEach((product, index) => {
      if (product.model.id == modelId) {
        products[index].displayPrice = cost;
        if (!product.isEdited) {
          products[index].priceMeter = cost;
        }
      }
      
    });
    this.updateExcelFile(partiya.excel.path, this.setString(products), true);

    return 'product updated!';
  }

  // utils:
  async findProduct(collection, model, path) {
    let products = this.readExcel(path);
    products = this.setJson(products);
    return products.find(
      (e) => e.collection.id == collection && e.model.id == model,
    );
  }

  setPrice(products = [], expense = 0) {
    const fullKv = products.reduce(
      (total, obj) =>
        total +
        (eval(obj.size.title.match(/\d+\.*\d*/g).join('*')) / 10000) *
          obj.count,
      0,
    );
    const expenseByKv = expense / fullKv;
    products = products.map((pr) => {
      pr.commingPrice = expenseByKv + pr.collectionPrice;
      delete pr.collectionPrice;
      delete pr.isEdited;
      return pr;
    });

    return products;
  }

  getMaxId(oldProducts: Array<{ id: number }>) {
    let maxId = 0;
    if (oldProducts.length > 0) {
      for (const oldProduct of oldProducts) {
        maxId = maxId < oldProduct.id ? oldProduct.id : maxId;
      }
    }
    return maxId;
  }

  getTotalM2ByCollection(collection, products) {
    products = this.setJson(products).filter(
      (e) => e.collection.id === collection,
    );

    return products.reduce(
      (total, obj) =>
        total +
        (eval(obj.size.title.match(/\d+\.*\d*/g).join('*')) / 10000) *
          obj.count,
      0,
    );
  }

  async setModules(datas, byId = false) {
    let data = [];
    const toggle = byId ? 'getOne' : 'getOneByName';
    data = await this.setCollection(datas, toggle);
    data = await this.setModel(data, toggle);
    data = await this.setColor(data, toggle);
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
    const data = []
    for (let product of products) {
      product.collection = JSON.stringify(product.collection);
      product.model = JSON.stringify(product.model);
      product.color = JSON.stringify(product.color);
      product.shape = JSON.stringify(product.shape);
      product.style = JSON.stringify(product.style);
      product.otherImgs = JSON.stringify(product.otherImgs || []);
      product.size = JSON.stringify(product.size);
      data.push(product)
    }
    return data;
  }

  setProperty(products, filialId, country?) {
    for (let product of products) {
      delete product.collection;
      delete product.id;
      product.model = product.model.id;
      product.color = product.color.id;
      product.shape = product.shape.title;
      product.style = product.style.title;
      product.size = product.size.title;
      product.filial = filialId;
      product.country = country || 'пустой';
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
      if (product.otherImgs)
        product.otherImgs = JSON.stringify(product.otherImgs);
      if (product.size) product.size = JSON.stringify(product.size);
    }
    return products;
  }

  setJson(products) {
    const data = []
    for (let product of products) {
      console.log(product);
      product.collection = JSON.parse(product.collection);
      product.model = JSON.parse(product.model);
      product.color = JSON.parse(product.color);
      product.shape = JSON.parse(product.shape);
      product.style = JSON.parse(product.style);
      product.otherImgs = JSON.parse(product.otherImgs);
      product.size = JSON.parse(product.size);
      console.log(product);
      
      data.push(product);
    }
    
    return data;
  }

  setId(maxId, data) {
    data.forEach((_, index: number) => {
      data[index].id = ++maxId;
    });

    return data;
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
