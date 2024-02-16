import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, FindOptionsWhere, Repository } from 'typeorm';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { Product } from './product.entity';
import { CreateProductDto, UpdateInternetShopProductDto, UpdateProductDto } from './dto';
import { sizeParser } from 'src/infra/helpers';
import { FilialService } from '../filial/filial.service';
import { ModelService } from '../model/model.service';
import { PartiyaService } from '../partiya/partiya.service';

Injectable();
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly filialService: FilialService,
    private readonly modelService: ModelService,
  ) {}

  async getAll(options: IPaginationOptions, where?: FindOptionsWhere<Product>) {
    if (where['fields']) {
      if (!where?.filial) throw new BadRequestException('Filial should be exist!');
      const querybuilder = this.productRepository.createQueryBuilder('product');
      querybuilder.where('filial.id = :filial', { filial: where.filial });
      querybuilder.andWhere(
        new Brackets((cb) => {
          cb.where('product.count > 0')
            .orWhere('LOWER(product.shape) LIKE LOWER(:search)', { search: `%${where['search']}%` })
            .where('LOWER(collection.title) LIKE LOWER(:search)', { search: `%${where['search']}%` })
            .orWhere('LOWER(product.size) LIKE LOWER(:search)', { search: `%${where['search']}%` })
            .where('LOWER(model.title) LIKE LOWER(:search)', { search: `%${where['search']}%` })
            .orWhere('LOWER(product.style) LIKE LOWER(:search)', { search: `%${where['search']}%` });
        }),
      );
      querybuilder
        .leftJoinAndSelect('product.model', 'model')
        .leftJoinAndSelect('model.collection', 'collection')
        .leftJoinAndSelect('product.filial', 'filial')
        .getMany();

      return paginate(querybuilder, options);
    }

    return paginate<Product>(this.productRepository, options, {
      relations: {
        model: {
          collection: true,
        },
        filial: true,
        color: true,
      },
      where,
      order: { date: 'DESC' },
    });
  }

  async getOne(id: string) {
    const data = await this.productRepository
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

    return data;
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

  async getOneForExcel(id: string) {
    const data: any = await this.productRepository
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
    return data;
  }

  async getById(id: string) {
    const data = await this.productRepository
      .findOne({
        where: { id },
        relations: {
          filial: true,
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
    const response = await this.productRepository
      .createQueryBuilder()
      .update()
      .set(value as unknown as Product)
      .where('id = :id', { id })
      .execute();
    return response;
  }

  async changeInternetShopProduct(value: UpdateInternetShopProductDto, id: string) {
    const response = await this.productRepository
      .createQueryBuilder()
      .update()
      .set(value as unknown as Product)
      .where('id = :id', { id })
      .execute();

    return response;
  }

  async create(value: CreateProductDto[]) {
    value = this.setXy(value);

    const data = await this.productRepository
      .createQueryBuilder()
      .insert()
      .into(Product)
      .values(value as unknown as Product)
      .returning('id')
      .execute();

    return data;
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
    const remainingSum = data.length ? data.map((p) => p.price * p.count).reduce((a, b) => a + b) : 0;
    const remainingSize = data.length ? data.map((p) => p.totalSize).reduce((a, b) => a + b) : 0;
    const count = data.length ? data.map((p) => p.count).reduce((a, b) => a + b) : 0;
    return { remainingSize, remainingSum, count };
  }

  async getRemainingProductsForAllFilial() {
    const result = [];
    const allFilial = await this.filialService.getAllFilial();
    for (let data of allFilial) {
      const remain = await this.remainingProducts({ filial: { id: data.id } });
      result.push({ ...data, ...remain });
    }
    return result;
  }

  async getAllForTelegram() {
    const products = await this.productRepository
      .createQueryBuilder('user')
      .where('isInternetShop = :isInternetShop', { isInternetShop: true })
      .relation('filial')
      .of(Product)
      .loadOne();

    return { products, count: products.length };
  }

  async updateOrCreateProducts(productsData: any[]) {
    const ids = [];

    for (const productData of productsData) {
      const filial = await this.filialService.getOne(productData.filial);
      const model = await this.modelService.getOne(productData.model);

      if (filial && model) {
        const existingProduct = await this.productRepository.findOne({
          where: { id: productData.id },
        });

        if (existingProduct) {
          await this.change(productData, productData.id);
          ids.push(productData.id);
        } else {
          delete productData.id;
          const newProduct = await this.create(productData);

          ids.push(newProduct.raw[0].id);
        }
      } else {
        console.error('Filial or Model not found for product:', productData);
      }
    }

    return ids;
  }
}
