import { NotFoundException, Injectable } from '@nestjs/common';
import { FindOptionsWhere, Repository, ILike } from 'typeorm';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { InjectRepository } from '@nestjs/typeorm';
import * as XLSX from 'xlsx';

import { CreateQrBaseDto, UpdateQrBaseDto } from './dto';
import { QrBase } from './qr-base.entity';
import { deleteFile } from 'src/infra/helpers';
import { ColorService } from '../color/color.service';
import { CollectionService } from '../collection/collection.service';
import { CountryService } from '../country/country.service';
import { ModelService } from '../model/model.service';
import { ShapeService } from '../shape/shape.service';
import { SizeService } from '../size/size.service';
import { StyleService } from '../style/style.service';

@Injectable()
export class QrBaseService {
  constructor(
    @InjectRepository(QrBase)
    private readonly qrBaseRepository: Repository<QrBase>,
    private readonly colorService: ColorService,
    private readonly collectionService: CollectionService,
    private readonly countryService: CountryService,
    private readonly modelService: ModelService,
    private readonly shapeService: ShapeService,
    private readonly sizeService: SizeService,
    private readonly styleService: StyleService,
  ) {}

  async getAll(options: IPaginationOptions): Promise<Pagination<QrBase>> {
    return paginate<QrBase>(this.qrBaseRepository, options, {
      order: {
        date: 'DESC',
      },
      relations: {
        model: true,
        color: true,
        collection: true,
        size: true,
        shape: true,
        style: true,
        country: true,
      },
    });
  }

  async getOne(id: string) {
    const data = await this.qrBaseRepository
      .findOne({
        where: { id },
        relations: {
          model: true,
          color: true,
          collection: true,
          size: true,
          shape: true,
          style: true,
          country: true,
        },
      })
      .catch(() => {
        throw new NotFoundException('Qr-code not found');
      });

    return data;
  }

  async getOneByCode(code: string) {
    const data = await this.qrBaseRepository
      .findOne({
        where: { code },
        relations: {
          model: true,
          color: true,
          collection: true,
          size: true,
          shape: true,
          style: true,
          country: true,
        },
      })
      .catch(() => {
        throw new NotFoundException('Qr-code not found');
      });

    return data;
  }

  async deleteOne(id: string) {
    const response = await this.qrBaseRepository.delete(id).catch(() => {
      throw new NotFoundException('Qr-code not found');
    });
    return response;
  }

  async change(value: UpdateQrBaseDto, id: string) {
    const response = await this.qrBaseRepository
      .createQueryBuilder()
      .update()
      .set(value as unknown as QrBase)
      .where('id = :id', { id })
      .execute();
    return response;
  }

  async create(value: CreateQrBaseDto) {
    const data = await this.qrBaseRepository
      .createQueryBuilder()
      .insert()
      .into(QrBase)
      .values(value as unknown as QrBase)
      .returning('id')
      .execute();

    return data;
  }

  async findOrCreate(codes: CreateQrBaseDto[]) {
    for (const support of codes) {
      if (support.code) {
        const response = await this.qrBaseRepository.findOne({
          where: { code: support.code },
        });

        if (!response) {
          let data = { ...support };

          data.collection = await this.collectionService.findOrCreate(data.collection);
          data.country ? (data.country = await this.countryService.findOrCreate(data.country)) : (data.country = null);
          data.model = await this.modelService.findOrCreate(data.collection['id'], data.model);
          data.color ? (data.color = await this.colorService.findOrCreate(data.color)) : (data.color = null);
          data.shape ? (data.shape = await this.shapeService.findOrCreate(data.shape)) : (data.shape = null);
          data.size ? (data.size = await this.sizeService.findOrCreate(data.size)) : (data.size = null);
          data.style ? (data.style = await this.styleService.findOrCreate(data.style)) : (data.style = null);

          await this.create(data);
        }
      }
    }
    return 'created succesfully!';
  }

  // utils:
  readExcel(path: string) {
    const workbook = XLSX.readFile(path);
    const worksheet = workbook.Sheets['Sheet'];
    const data: any[] = XLSX.utils.sheet_to_json(worksheet);
    deleteFile(path);

    return data;
  }
}
