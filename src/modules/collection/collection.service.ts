import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { FindOptionsWhere, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';

import { Collection } from './collection.entity';
import { CreateCollectionDto, UpdateCollectionDto } from './dto';
import { prodSearch } from '../product/utils';

Injectable();
export class CollectionService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
  ) {}

  async getAll(options: IPaginationOptions, where?: FindOptionsWhere<Collection>): Promise<Pagination<Collection>> {
    return paginate<Collection>(this.collectionRepository, options, {
      order: {
        title: 'ASC',
      },
      relations: {
        model: true,
      },
    });
  }

  async getAllInternetShop(
    options: IPaginationOptions,
    where?: FindOptionsWhere<Collection>,
  ): Promise<Pagination<Collection>> {
    return await paginate<Collection>(this.collectionRepository, options, {
      order: {
        title: 'ASC',
      },
      relations: {
        model: { products: { color: true } },
      },
      where: {
        ...(where && where),
        model: { products: { isInternetShop: true } },
      },
    });
  }

  async getAllData() {
    return await this.collectionRepository.find({
      order: {
        title: 'ASC',
      },
      relations: {
        model: true,
      },
    });
  }

  async getOne(id: string) {
    const data = await this.collectionRepository
      .findOne({
        where: { id },
        relations: {
          model: true,
        },
      })
      .catch(() => {
        throw new NotFoundException('data not found');
      });

    return data;
  }

  async getOneExcel(id: string) {
    const data = await this.collectionRepository
      .findOne({
        where: { id },
        relations: {
          productsExcel: { partiya: true },
        },
      })
      .catch(() => {
        throw new NotFoundException('data not found');
      });

    return data;
  }

  async getOneByName(title: string) {
    const data = await this.collectionRepository
      .findOne({
        where: { title },
      })
      .catch(() => {
        throw new NotFoundException('collection not found');
      });

    return data;
  }

  async deleteOne(id: string) {
    const response = await this.collectionRepository.delete(id).catch(() => {
      throw new NotFoundException('collection not found');
    });
    return response;
  }

  async change(value: UpdateCollectionDto, id: string) {
    const response = await this.collectionRepository.update({ id }, value);
    return response;
  }

  async create(value: CreateCollectionDto) {
    const data = this.collectionRepository.create(value);
    return await this.collectionRepository.save(data);
  }

  async remainingProductsByCollection(query) {
    let data = [];
    if (query?.filial && query.filial != 'null') {
      data = await this.collectionRepository.find({
        relations: { model: { products: { filial: true } } },
        where: query?.filial ? { ...(query?.collection && { id: query.collection }),
          model: {
            ...(query?.model && { id: query.model }),
            products: { filial: { id: query.filial }, count: MoreThan(0) },
          },
        } : {},
      });
    } else if (query?.collection) {
      data = await this.collectionRepository.find({
        relations: { model: { products: { color: true } } },
        where: { id: query.collection, model: { products: { count: MoreThan(0) } } },
      });
    } else if (query.model) {
      data = await this.collectionRepository.find({
        relations: { model: { products: { color: true, model: { collection: true } } } },
        where: {
          model: { id: query.model, products: { count: MoreThan(0) } },
        },
      });
    } else {
      data = await this.collectionRepository.find({
        relations: { model: { products: { filial: true } } },
        where: { model: { products: { count: MoreThan(0) } } },
      });
    }

    let result = [];
    for (let i = 0; i < data.length; i++) {
      let remainingSum = 0,
        remainingSize = 0,
        remainingCount = 0;
      for (let j = 0; j < data[i].model.length; j++) {
        const products = data[i].model[j].products;
        let prodSum = products.length ? products.map((p) => +p.price * p.count).reduce((a, b) => a + b) : 0;
        remainingSum += prodSum;

        let prodSize = products.length ? products.map((p) => +p.totalSize).reduce((a, b) => a + b) : 0;
        remainingSize += prodSize;

        let prodCount = products.length ? products.map((p) => p.count).reduce((a, b) => a + b) : 0;
        remainingCount += prodCount;

        data[i].model[j].count = prodCount;
        data[i].model[j].totalSize = prodSize;
        data[i].model[j].totalSum = prodSum;
      }
      if (remainingSize > 0) {
        result.push({
          id: data[i].id,
          title: data[i].title,
          remainingCount,
          remainingSize,
          remainingSum,
          ...(query?.collection && { model: data[i].model.filter((e) => e.products.length) }),
          ...(query?.model && { model: data[i].model[0].products }),
        });
      }
    }
    return result;
  }

  async remainingProductsByCollectionTransfer({
    limit = 10,
    page = 1,
    collection,
    filial,
                                                search,
                                                _user,
  }): Promise<Pagination<Collection>> {
    if (search) {
      const products = (await this.collectionRepository.query(prodSearch({
        text: search,
        filialId: filial,
        base: _user?.role && _user?.role > 2,
        offset: (+page - 1) * +limit,
        limit: limit,
        total: false,
        shop: false,
        collection
      }))) || [];

      const total = (await this.collectionRepository.query(prodSearch({
        text: search,
        filialId: filial,
        base: _user?.role && _user?.role > 2,
        offset: (+page - 1) * +limit,
        limit: limit,
        total: true,
        shop: false,
        collection
      }))) || [];

      return {
        items: products,
        meta: {
          'totalItems': +total[0].count,
          'itemCount': products.length,
          'itemsPerPage': +limit,
          'totalPages': Math.ceil(+total[0].count / +limit),
          'currentPage': +page,
        },
      };


    }

    const where = {
      ...(collection && { id: collection }),
      model: {
        products: {
          ...(filial && { filial: { id: filial } }),
          count: MoreThanOrEqual(1),
          y: MoreThanOrEqual(1),
        },
      },
    };

    const data2 = await paginate<Collection>(
      this.collectionRepository,
      { limit, page },
      {
        relations: { model: { products: { filial: true, color: true, model: { collection: true } } } },
        where,
      },
    );

    let result = [];
    for (let i = 0; i < data2.items.length; i++) {
      let remainingSum = 0,
        remainingSize = 0,
        remainingCount = 0,
        products = [];
      for (let j = 0; j < data2.items[i].model.length; j++) {
        const items = data2.items[i].model[j].products;
        remainingSum += items.length ? items.map((p) => +p.price * p.count).reduce((a, b) => a + b) : 0;
        remainingSize += items.length ? items.map((p) => +p.totalSize).reduce((a, b) => a + b) : 0;
        remainingCount += items.length ? items.map((p) => p.count).reduce((a, b) => a + b) : 0;
        collection && products.push(...items);
      }
      if (collection) {
        // @ts-ignore
        data2.meta.totalItems = products.length;
      }
      collection ? products.length && (result = products) : result.push({
        remainingCount,
        remainingSize,
        remainingSum,
        title: data2.items[i].title,
        id: data2.items[i].id,
      });

    }

    return {
      items: result,
      meta: data2?.meta,
      links: data2?.links,
    };
  }

  async findOrCreate(title) {
    const response = await this.collectionRepository.findOne({
      where: { title },
    });

    if (!response) {
      const res = await this.create({ title });
      return res.id;
    }
    return response.id;
  }
}
