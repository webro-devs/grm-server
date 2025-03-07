import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, In, MoreThan, Not, Repository } from 'typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { Product } from './product.entity';
import { CreateProductDto, UpdateInternetShopProductDto, UpdateProductDto } from './dto';
import { sizeParser } from 'src/infra/helpers';
import { FilialService } from '../filial/filial.service';
import { ModelService } from '../model/model.service';
import {
  getByCode,
  getSupports,
  internetInfoBulkUpdate,
  internetShop,
  internetShopByModel,
  iShopAccounting,
  prodSearch,
  productImgBulkUpdate,
  productMediumByStyleQuery,
  productSecondPriceBulkUpdate,
} from './utils';
import { FileService } from '../file/file.service';
import { ColorService } from '../color/color.service';
import { CollectionService } from '../collection/collection.service';
import createProductDto from './dto/create-product.dto';

Injectable();
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly filialService: FilialService,
    private readonly fileService: FileService,
    private readonly modelService: ModelService,
    private readonly colorService: ColorService,
    private readonly collectionService: CollectionService,
  ) {
  }

  async getAll(
    options: IPaginationOptions,
    where?: FindOptionsWhere<Product>,
    _user?: { role: number; },
  ) {
    if (where?.['fields']) {
      if (!where['search']) {
        throw new BadRequestException('Search must be provided.');
      }

      // Fetch products
      const products = (await this.productRepository.query(prodSearch({
        text: where['search'],
        filialId: where?.filial,
        base: _user?.role && _user?.role > 2,
        offset: (+options.page - 1) * +options.limit,
        limit: options.limit,
        total: false,
        shop: where?.isInternetShop,
        collection: where.model?.['collection']?.id
      }))) || [];

      // Fetch total count
      const total = (await this.productRepository.query(prodSearch({
        text: where['search'],
        filialId: where?.filial,
        base: _user?.role && _user?.role > 2,
        offset: (+options.page - 1) * +options.limit,
        limit: options.limit,
        total: true,
        shop: where?.isInternetShop,
        collection: where.model?.['collection']?.id
      }))) || [];

      return {
        items: products,
        meta: {
          totalItems: +total[0].total,
          itemCount: products.length,
          itemsPerPage: +options.limit,
          totalPages: Math.ceil(+total[0].total / +options.limit),
          currentPage: +options.page,
        },
      };
    }

    // Default pagination if no custom search is performed
    return paginate<Product>(this.productRepository, options, {
      relations: {
        model: { collection: true },
        filial: true,
        color: true,
        bookings: {
          user: { filial: true },
        },
      },
      where: {
        ...where,
        y: MoreThan(0),
        count: MoreThan(0),
        ...(_user && _user?.role > 2
            ? { ...(where.filial && { filial: { id: where.filial['id'] } }) }
            : { filial: { title: Not('baza'), ...(where.filial && { id: where.filial['id'] }) } }
        ),
      },
      order: { date: 'DESC' },
    });
  }


  async getOne(id: string) {
    return this.productRepository
      .findOne({
        where: { id },
        relations: {
          model: {
            collection: true,
          },
          filial: true,
          color: true,
        },
      })
      .catch(() => {
        throw new NotFoundException('Product not found');
      });
  }

  async getProdsByStyle(){
    return this.productRepository.query(productMediumByStyleQuery());
  }

  async getByCollections(quer: any, id: string) {
    const filial = await this.filialService.getOne(id);
    if (!filial || !id) {
      throw new BadRequestException('Filial Not Found!');
    }

    if (!quer.collection) {
      throw new BadRequestException('Collection Not Found!');
    }
    for await (const id of JSON.parse(quer.collection)) {
      const collection = await this.collectionService.getOne(id);
      if(!collection){
        throw new BadRequestException(`collection not fount by: ${id}`);
      }
    }

    let where = {
      filial: { id },
      ...(quer.collection && JSON.parse(quer.collection) && { model: { collection: In(JSON.parse(quer.collection)) } }),
    };

    return await this.productRepository.find({
      where, relations: {
        filial: true,
        color: true,
        model: { collection: true },
      },
    });
  }

  async getBaza({ limit, page, route }) {
    const [products, totalCount] = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.model', 'model')
      .leftJoinAndSelect('product.filial', 'filial')
      .leftJoinAndSelect('product.color', 'color')
      .where('filial.title = :title', { title: 'baza' })
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();

    return {
      data: products,
      totalCount,
      route,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    };
  }

  async getById(id: string) {
    const data = await this.productRepository
      .findOne({
        where: { id },
        relations: {
          filial: true,
          color: true,
          model: true,
        },
      })
      .catch(() => {
        throw new NotFoundException('Product not found');
      });

    return data;
  }

  async getMoreByIds(ids: string[]) {
    const data = await this.productRepository.createQueryBuilder().where('id IN(:...ids)', { ids }).getMany();
    return data;
  }

  async getMaxPrice(): Promise<number> {
    const query = 'SELECT MAX("priceMeter") AS maxPrice FROM product as p WHERE p.count > 0 and p.y > 0;';
    const result = await this.productRepository.query(query);

    return result[0];
  }

  async deleteOne(id: string) {
    const response = await this.productRepository.delete(id).catch(() => {
      throw new NotFoundException('Product not found');
    });
    return response;
  }

  async changeIsInternetShop(ids: string[]) {
    const response = await this.productRepository
      .createQueryBuilder()
      .update()
      .set({ isInternetShop: true })
      .where('id IN(:...ids)', { ids })
      .execute();

    return response;
  }

  async change(value: UpdateProductDto, id: string) {
    if(value?.collection){
      delete value.collection
    }
    if(value?.size){
      const xy = sizeParser(value.size);
      value.x = xy[0] / 100;
      value.y = xy[1] / 100;
      value.totalSize = (eval(value.size.match(/\d+\.*\d*/g).join('*')) / 10000) * value.count;
      value.price = Number(value.priceMeter) * (value.x * value.y);
    }
    if (value.priceMeter) {
      value.price = Number(value.priceMeter) * (value.x * value.y);
    }

    if (value?.imgUrl) {
      const product = await this.getById(id);
      if ( (product?.model || value?.model) && (product.color || value.color) && (product.shape || value.shape)) {
        const color = await this.colorService.getOne(value?.color ? value.color : product.color.id);
        const model = await this.modelService.getOne(value?.model ? value.model : product.model.id);
        if (value.shape || product.shape) {
          const data = {
            shape: value.shape ? value.shape : product.shape,
            url: value.imgUrl,
            color: color.title,
            model: model.title,
          };
          const file = await this.fileService.getByModelAndColor(data.model, data.color, data.shape);
          if (!file) {
            await this.fileService.create(data);
          }
        }
      }
    }

    const data = await this.productRepository
      .createQueryBuilder()
      .update()
      .set(value as unknown as Product)
      .where('id = :id', { id })
      .execute();

    const prod = await this.productRepository.findOne({
      where: { id },
      relations: { model: { collection: true }, color: true },
    });

    if (value?.internetInfo) {
      await this.productRepository.query(internetInfoBulkUpdate(prod.model.collection.id, value?.internetInfo));
    }

    if (value?.imgUrl && prod.model) {
      await this.productRepository.query(productImgBulkUpdate(value.imgUrl, prod.model.title, prod.color.title, prod.shape));
    }

    if (value.secondPrice) {
      await this.productRepository.query(productSecondPriceBulkUpdate(prod.model.collection.id, value.size ? value.size : prod.size, value.secondPrice));
    }

    return data;
  }

  async changeInternetShopProduct(value: UpdateInternetShopProductDto, id: string) {
    return await this.productRepository
      .createQueryBuilder()
      .update()
      .set(value as unknown as Product)
      .where('id = :id', { id })
      .execute();
  }

  async create(value: CreateProductDto[], type = false) {
    let y = value[0].y
    value = this.setXy(value);
    if(type){
      value[0].y = y;
    }
    await this.productRepository.save(value as unknown as Product, { chunk: Math.floor(value.length / 20) });
    return "ok";
  }

  async create4Manager(value: createProductDto, type: boolean) {
    let y = value.y;
    value = this.setXy([value])[0];
    if (type) {
      value.y = y;
    }
    return await this.productRepository
      .createQueryBuilder()
      .insert()
      .into(Product)
      .values(value as unknown as Product)
      .returning('id')
      .execute();
  }

  setXy(value: CreateProductDto[]): CreateProductDto[] {
    for (let i = 0; i < value.length; i++) {
      const xy = sizeParser(value[i].size);
      value[i].x = xy[0] / 100;
      value[i].y = xy[1] / 100;
      value[i].totalSize = (eval(value[i].size.match(/\d+\.*\d*/g).join('*')) / 10000) * value[i].count;
      value[i].price = Number(value[i].priceMeter) * (value[i].x * value[i].y);
    }
    return value;
  }

  async remainingProducts(where) {
    const data = await this.productRepository.find({
      where,
    });

    if (data.length) {
      return data.reduce(
        (acc, item) => {
          acc.remainingSize += item.totalSize || 0;
          acc.count += item.count || 0;
          acc.remainingSum += item.priceMeter * item.totalSize || 0;
          return acc;
        },
        { remainingSize: 0, remainingSum: 0, count: 0 },
      );
    } else {
      return { remainingSize: 0, remainingSum: 0, count: 0 };
    }
  }

  async getRemainingProductsForAllFilial(query?) {
    const result = [];
    const allFilial = await this.filialService.getAllFilial();

    if(query?.filial){
      const remail =  await this.remainingProducts({ filial: { id: query.filial } });
      result.push(remail);
      return result;
    }

    for (let data of allFilial) {
      const remain = await this.remainingProducts({ filial: { id: data.id } });
      result.push({ ...data, ...remain });
    }
    return result;
  }

  async getAllForTelegram() {
    const products = await this.productRepository.find({
      where: { isInternetShop: true, count: MoreThan(0), y: MoreThan(0) },
      relations: { filial: true, model: { collection: true }, color: true },
    });

    return { products, count: products.length };
  }

  async getIShopAccounting(query: { by: string }): Promise<[{ sold_shop_products: string, percentage_sold: string, sold_shop_products_first: string }]> {
    return this.productRepository.query(iShopAccounting(query));
  }

  async getByCode(code: string){
    if (!code){
      throw new BadRequestException('code must be exist');
    }
    const product = (await this.productRepository.query(getByCode(code)))[0];
    if(!product){
      throw new BadRequestException('This product is not found!');
    }
    return  product;
  }

  async getSupports(collection: string, model: string, shape: string, color: string, size: string) {
    return await this.productRepository.query(getSupports(collection, model, shape, color, size));
  }

  async internetShop(query) {
    if (query.collection) {
      return await this.productRepository.query(
        internetShopByModel(
          query.collection || false,
          query.size || false,
          query.style || false,
          query.color || false,
        ),
      );
    }
    return await this.productRepository.query(internetShop());
  }

  getFilial(array: Product[]){
    const map = new Map();

    array.forEach(item => {
      map.set(item.filial.id, item.filial); // using 'id' as the unique key
    });

    return Array.from(map.values());
  }

  async getInternetProductSingle(index: number) {
    const [product] = await this.productRepository.find({
      where: {
        isInternetShop: true,
      },
      order: {
        date: 'ASC',
      },
      relations: {
        color: true,
        model: { collection: true },
      },
      skip: index,
      take: 1,
    });
    return product;
  }

  async getPriceInternetProduct(id: string) {
    const oldProduct = await this.productRepository.findOne({
      where: {
        id,
      },
      relations: {
        model: { collection: true },
      },
    });

    const [product] = await this.productRepository.find({
      where: {
        isInternetShop: true,
        model: {
          collection: { id: oldProduct.model.collection.id },
        },
        size: ILike(`${oldProduct.size}`),
      },
    });

    return product?.secondPrice || 0;
  }

  async changeBookCount({ id, book_count }: { id: string, book_count: number }) {
    return await this.productRepository
      .createQueryBuilder()
      .update()
      .set({ book_count })
      .where('id = :id', { id })
      .execute();
  }

  async getOneForTransfer(id: string) {
    return this.productRepository
      .findOne({
        where: { id, count: MoreThan(0), y: MoreThan(0.3) },
        relations: {
          model: {
            collection: true,
          },
          filial: true,
          color: true,
        },
      });
  }

  async calculateSum(
    productIds: string[],
    filialId: string
  ) {
    const query = this.productRepository
      .createQueryBuilder('p')
      .select([
        'SUM(p.x * p.y * p.count * p."priceMeter") AS "totalSum"',
        'SUM(p.count) AS "totalCount"',
        'SUM(p.x * p.y * p.count * p."comingPrice") AS "totalComingSum"',
        'SUM(p.x * p.y * p.count) AS "totalSize"',
      ])
      .where('p.count > 0.3 AND p.y > 0.3')
      .andWhere('p."filialId = :filialId', { filialId });

    if (productIds && productIds.length > 0) {
      query.andWhere('p.id IN (:...productIds)', { productIds });
    }

    const result = await query.getRawOne();

    return {
      totalSum: Number(result.totalSum) || 0,
      totalCount: Number(result.totalCount) || 0,
    };
  }
}
