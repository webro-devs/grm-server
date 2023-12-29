import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

import { UpdateCountryDto, CreateCountryDto } from './dto';
import { Country } from './country.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { StyleService } from '../style/style.service';
import { ColorService } from '../color/color.service';
import { ShapeService } from '../shape/shape.service';
import { ModelService } from '../model/model.service';
import { CollectionService } from '../collection/collection.service';
import { SizeService } from '../size/size.service';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    private readonly styleService: StyleService,
    private readonly colorService: ColorService,
    private readonly shapeService: ShapeService,
    private readonly modelService: ModelService,
    private readonly collectionService: CollectionService,
    private readonly sizeService: SizeService,
  ) {}

  async getAllSp() {
    const countries = await this.countryRepository.find();
    const styles = await this.styleService.getAll();
    const colors = await this.colorService.getAll();
    const shapes = await this.shapeService.getAll();
    const models = await this.modelService.getAllModel();
    const collections = await this.collectionService.getAllData();
    const sizes = await this.sizeService.getAll();

    return { countries, styles, colors, shapes, models, collections, sizes };
  }

  async getAll(
    options: IPaginationOptions,
    where?: FindOptionsWhere<Country>,
  ): Promise<Pagination<Country>> {
    return paginate<Country>(this.countryRepository, options, {
      order: {
        title: 'ASC',
      },
    });
  }

  async getOne(id: string) {
    const data = await this.countryRepository
      .findOne({
        where: { id },
      })
      .catch(() => {
        throw new NotFoundException('Country not found');
      });

    return data;
  }

  async deleteOne(id: string) {
    const response = await this.countryRepository.delete(id).catch(() => {
      throw new NotFoundException('Country not found');
    });
    return response;
  }

  async change(value: UpdateCountryDto, id: string) {
    const response = await this.countryRepository.update({ id }, value);
    return response;
  }

  async create(value: CreateCountryDto) {
    const data = this.countryRepository.create(value);
    return await this.countryRepository.save(data);
  }

  async findOrCreate(title) {
    const response = await this.countryRepository.findOne({
      where: { title },
    });

    if (!response) {
      return (await this.create(title)).id;
    }
    return response.id;
  }
}
