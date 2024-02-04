import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as XLSX from 'xlsx';

import { Excel } from './excel.entity';
import { ProductExcel } from './excel-product.entity';
import { deleteFile, excelDataParser } from 'src/infra/helpers';
import { FileService } from '../file/file.service';
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
import { CreateProductExcelDto, UpdateProductExcelDto } from './dto';
import { QrBaseService } from '../qr-base/qr-base.service';
import { CreateQrBaseDto } from '../qr-base/dto';

Injectable();
export class ExcelService {
  constructor(
    @InjectRepository(Excel)
    private readonly excelRepository: Repository<Excel>,
    @InjectRepository(ProductExcel)
    private readonly productExcelRepository: Repository<ProductExcel>,
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
    private readonly qrBaseService: QrBaseService,
  ) {}
  async readExcel(id: string) {
    const data = await this.partiyaService.getOneProds(id);

    return data;
  }

  async getOne(id: string) {
    const res = await this.productExcelRepository.findOne({
      where: { id },
      relations: { collection: true, model: true, color: true, partiya: true, shape: true, size: true, style: true },
    });

    return res;
  }

  async delete(id: string) {
    await this.productExcelRepository.delete(id);

    return 'Deleted successfully!';
  }

  readExcelFile(path: string) {
    const workbook = XLSX.readFile(path);
    const worksheet = workbook.Sheets['Sheet'];
    const data: any[] = XLSX.utils.sheet_to_json(worksheet);
    deleteFile(path);

    return data;
  }

  async addProductToPartiya(products: CreateProductExcelDto[], partiyaId: string) {
    const partiya = await this.partiyaService.getOne(partiyaId);
    if (!partiya) {
      throw new BadRequestException('Partiya not found!');
    }

    const productPromises: CreateProductExcelDto[] = [];
    for (const e of products) {
      if (!e.collection || !e.model) {
        let msg = e.collection ? 'Collection must exist!' : 'Model must exist!';
        throw new BadRequestException(msg);
      }
      const price = await this.returnPrice(e.model);
      const count = e.count < 1 ? 1 : e.count;
      const updatedProduct: CreateProductExcelDto = {
        ...e,
        partiya: partiya.id,
        country: e.country || partiya.country,
        count,
        ...price,
      };

      productPromises.push(updatedProduct);
    }

    const data = await this.productExcelRepository
      .createQueryBuilder()
      .insert()
      .into(ProductExcel)
      .values(productPromises as unknown as ProductExcel)
      .returning('id')
      .execute();

    return data;
  }

  async addProductToPartiyaWithExcel(products: CreateProductExcelDto[], partiyaId: string) {
    const partiya = await this.partiyaService.getOne(partiyaId);
    if (!partiya) {
      throw new BadRequestException('Partiya not found!');
    }
    const prod = [];

    for (const support of products) {
      if (support.model && support.collection) {
        let data = { ...support };

        const collection = await this.collectionService.getOneByName(data.collection);
        const model = await this.modelService.getOneByName(data.model);
        if (!collection) {
          throw new BadRequestException('collection not found!');
        }
        if (!model) {
          throw new BadRequestException('model not found!');
        }
        data?.country ? data.country : (data.country = partiya.country);
        data.partiya = partiya.id;
        data.color = (await this.colorService.getOneByName(data.color))?.id || null;
        data.shape = (await this.shapeService.getOneByName(data.shape))?.id || null;
        data.size = (await this.sizeService.getOneByName(data.size))?.id || null;
        data.style = (await this.styleService.getOneByName(data.style))?.id || null;
        data.count = data.count < 1 ? 1 : data.count;
        const price = await this.returnPrice(data.model);
        data = { ...data, ...price };

        prod.push(data);
      } else {
        let msg = support.collection ? 'Collection must be exist!' : 'Model must be exist!';
        throw new BadRequestException(msg);
      }
    }

    const data = await this.productExcelRepository
      .createQueryBuilder()
      .insert()
      .into(ProductExcel)
      .values(prod as unknown as ProductExcel)
      .returning('id')
      .execute();

    return data;
  }

  async readProducts(partiyaId: string) {
    const partiya = await this.partiyaService.getOne(partiyaId);
    if (partiya) {
      const data = await this.partiyaService.getOneProds(partiyaId);

      return excelDataParser(data.productsExcel, partiya.expense);
    }
    throw new BadRequestException('Partiya not found!');
  }

  async updateCollectionCost(newData: { id: string; cost: number; partiyaId: string }) {
    console.log(newData);

    const collection = await this.collectionService.getOneExcel(newData.id);

    if (!collection) {
      throw new Error('Collection not found');
    }

    const productIds = collection.productsExcel.map((product) => {
      if (product?.partiya?.id == newData?.partiyaId) return product.id;
    });

    // Update collectionPrice for products in the collection using the product IDs
    await this.productExcelRepository
      .createQueryBuilder()
      .update(ProductExcel)
      .set({ collectionPrice: newData.cost }) // Set the updated value
      .whereInIds(productIds) // Update products with matching IDs
      .execute();
  }

  async updateModelCost(newData: { id: string; cost: number; partiyaId: string }) {
    const collection = await this.modelService.getOneExcel(newData.id);

    if (!collection) {
      throw new Error('Model not found');
    }

    const productIds = collection.productsExcel.map((product) => {
      if (!product?.isEdited && product?.partiya?.id == newData?.partiyaId) return product.id;
    });

    // Update collectionPrice for products in the collection using the product IDs
    await this.productExcelRepository
      .createQueryBuilder()
      .update(ProductExcel)
      .set({ displayPrice: newData.cost, priceMeter: newData.cost }) // Set the updated value
      .whereInIds(productIds) // Update products with matching IDs
      .execute();
  }

  async updateProduct(value, id) {
    const response = await this.productExcelRepository.update({ id }, value);
    return response;
  }

  async readProductsByModel(partiyaId: string, id: string) {
    const response = await this.modelService.productByExcel(id, partiyaId);
    //@ts-ignore
    response['products'] = response.productsExcel;
    delete response.productsExcel;

    return response;
  }

  async checkProductCode(newData: { code: string; id: string }) {
    const code = await this.qrBaseService.getOneByCode(newData.code);
    console.log(newData.code, ' : ', code);

    if (!code) {
      throw new BadRequestException('Code not exist!');
    }
    const product = await this.productExcelRepository.findOne({
      relations: { partiya: true },
      where: { code: newData.code, partiya: { id: newData.id } },
    });
    if (product) {
      product.count += 1;
      await this.productExcelRepository.save(product);
      return 'Added Product +1';
    }
    const value: CreateProductExcelDto = {
      code: code.code,
      collection: code?.collection?.id || null,
      collectionPrice: 0,
      color: code?.color?.id || null,
      commingPrice: 0,
      count: 1,
      country: code?.country?.title || null,
      displayPrice: 0,
      imgUrl: '',
      isEdited: false,
      isMetric: false,
      model: code?.model?.id,
      otherImgs: [],
      partiya: newData.id,
      priceMeter: 0,
      shape: code?.shape?.id || null,
      size: code?.size?.id || null,
      style: code?.style?.id || null,
    };
    const productIds = await this.addProductToPartiya([value], newData.id);
    return await this.productExcelRepository.findOne({
      where: { id: productIds.raw[0].id },
      relations: { size: true, model: true, style: true, shape: true, color: true, collection: true },
    });
  }

  async createWithCode(newData: CreateQrBaseDto, partiyaId) {
    if (!newData.code) throw new BadRequestException('Code Not Exist!');

    const value: CreateQrBaseDto = {
      code: newData.code,
      collection: newData.collection,
      color: newData.color,
      country: newData.country,
      model: newData.model,
      shape: newData.shape,
      size: newData.size,
      style: newData.style,
    };
    const data = await this.qrBaseService.getOneCode(newData.code);

    if (data.length < 1) {
      await this.qrBaseService.create(value);
    }

    const code = await this.qrBaseService.getOneByCode(newData.code);
    const Product: CreateProductExcelDto = {
      code: code.code,
      collection: code.collection.id,
      collectionPrice: 0,
      color: code.color.id || null,
      commingPrice: 0,
      count: Number(newData.count) || 1,
      country: code.country.title || null,
      displayPrice: 0,
      imgUrl: null,
      isEdited: false,
      isMetric: false,
      model: code.model.id,
      otherImgs: [],
      partiya: partiyaId,
      priceMeter: 0,
      shape: code.shape.id || null,
      size: code.size.id || null,
      style: code.style.id || null,
    };

    return await this.addProductToPartiya([Product], partiyaId);
  }
  async createWithCodeExcel(newDatas: CreateQrBaseDto[], partiyaId) {
    const partiya = await this.partiyaService.getOne(partiyaId);
    if (!partiya) throw new BadRequestException('Partiya not Found!');
    const products = [];
    const check = newDatas.filter((e) => !e?.collection || !e.model);
    if (check.length > 0) throw new BadRequestException("Collection or Model don't come, please check your excel!");

    for (const newData of newDatas) {
      if (!newData.code) throw new BadRequestException('Code Not Exist!');

      const value: CreateQrBaseDto = {
        code: newData.code,
        collection: newData.collection,
        color: newData.color,
        country: newData.country,
        model: newData.model,
        shape: newData.shape,
        size: newData.size,
        style: newData.style,
      };

      const data = await this.qrBaseService.getOneCode(newData.code);
      console.log(data);

      if (data.length < 1) {
        await this.qrBaseService.create(value);
      }

      const code = await this.qrBaseService.getOneByCode(newData.code);
      const Product: CreateProductExcelDto = {
        code: code.code,
        collection: code.collection.id,
        collectionPrice: 0,
        color: code?.color?.id || null,
        commingPrice: 0,
        count: Number(newData?.count) || 1,
        country: code?.country?.title || null,
        displayPrice: 0,
        imgUrl: null,
        isEdited: false,
        isMetric: false,
        model: code.model.id,
        otherImgs: [],
        partiya: partiyaId,
        priceMeter: 0,
        shape: code?.shape?.id || null,
        size: code?.size?.id || null,
        style: code?.style?.id || null,
      };
      products.push(Product);
    }

    return await this.addProductToPartiya(products, partiyaId);
  }

  async createProduct(partiyaId, filialId) {
    try {
      const partiya = await this.partiyaService.getOne(partiyaId);
      if (partiya.check) {
        throw new BadRequestException('Partiya already sended to filials');
      }
      let products = await this.productExcelRepository.find({
        relations: {
          size: true,
          model: true,
          style: true,
          shape: true,
          color: true,
          partiya: true,
        },
        where: { partiya: { id: partiyaId } },
      });
      products = await this.setImg(products);
      products = this.setPrice(products);
      const filial = await this.filialService.findOrCreateFilialByTitle('baza');
      let productss = this.setProperty(products, filialId ? filialId : filial.id);

      const response = await this.productService.create(productss);
      await this.partiyaService.change({ check: true }, partiya.id);
      return response;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  // #utils
  setPrice(products = [], expense = 0) {
    const fullKv = products.reduce(
      (total, obj) => total + (eval(obj?.size?.title?.match(/\d+\.*\d*/g).join('*') || 0) / 10000) * obj.count,
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

  setProperty(products, filialId, country = 'Not found') {
    try {
      console.log(products);
      for (let product of products) {
        if (!product?.size?.title) {
          throw new BadRequestException('Product size must be exist!');
        }
        if (!product?.shape) {
          throw new BadRequestException('Product shape must be exist!');
        }
        if (!product?.style) {
          throw new BadRequestException('Product style must be exist!');
        }

        if (product?.count < 1) {
          throw new BadRequestException('Product count must be upper than 0!');
        }

        delete product.id;
        delete product.displayPrice;
        product.filial = filialId;
        product.size = product.size.title;
        product.model = product.model.id;
        product.style = product?.style?.title || null;
        product.color = product?.color?.id || null;
        product.shape = product?.shape?.title || null;
        product.partiya = product?.partiya?.id || null;
        product.country ? product?.country : (product.country = country);
      }
      return products;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async setImg(data) {
    for (const item of data) {
      if (!item.imgUrl) {
        if (item?.model && item?.color) {
          data.imgUrl = await this.fileService.getByModelAndColor(item.model?.title, item.color?.title);
        } else data.imgUrl = null;
      }
    }

    return data;
  }

  async returnPrice(
    model,
  ): Promise<{ collectionPrice: number; commingPrice: number; displayPrice: number; priceMeter: number }> {
    const product = model ? await this.productExcelRepository.findOne({ where: { model: { id: model } } }) : null;

    return {
      collectionPrice: product ? product.collectionPrice : 0,
      commingPrice: product ? product.commingPrice : 0,
      displayPrice: product ? product.displayPrice : 0,
      priceMeter: product ? product.displayPrice : 0,
    };
  }
}

// async createExcelFile(datas, pathname) {
//   const workbook = XLSX.utils.book_new();

//   const worksheet = XLSX.utils.json_to_sheet(datas);
//   XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet');
//   const filePath = path.join(process.cwd(), pathname);

//   await fs.promises.writeFile(
//     filePath,
//     XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' }),
//   );

//   return pathname;
// }

// async updateExcelFile(pathName, newData, restrict: boolean = false) {
//   const workbook = XLSX.utils.book_new();
//   let oldData: any[] = [];
//   restrict ? (oldData = []) : (oldData = this.readExcel(pathName));
//   deleteFile(pathName);

//   oldData = [...newData, ...oldData];
//   const worksheet = XLSX.utils.json_to_sheet(oldData);
//   XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet');

//   const filePath = path.join(process.cwd(), pathName);
//   await fs.promises.writeFile(
//     filePath,
//     XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' }),
//   );

//   return oldData;
// }

// setPrice(products = [], expense = 0) {
//   const fullKv = products.reduce(
//     (total, obj) =>
//       total +
//       (eval(obj.size.title.match(/\d+\.*\d*/g).join('*')) / 10000) *
//         obj.count,
//     0,
//   );
//   const expenseByKv = expense / fullKv;
//   products = products.map((pr) => {
//     pr.commingPrice = expenseByKv + pr.collectionPrice;
//     delete pr.collectionPrice;
//     delete pr.isEdited;
//     return pr;
//   });

//   return products;
// }
