import { Injectable, NotFoundException } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
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
import { qr_search } from './utils';
import QrBaseQueryDto from 'src/infra/shared/dto/qr-base.query.dto';

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

  async getAll(options: IPaginationOptions, query: QrBaseQueryDto): Promise<Pagination<QrBase>> {
    if(query?.search){
      query.search = query.search.split('+').join(' ');

      console.log(options);
      const data = await this.qrBaseRepository.query(qr_search(query.search, (+options.page - 1) * +options.limit, +options.limit, false));
      const total = await this.qrBaseRepository.query(qr_search(query.search, (+options.page - 1) * +options.limit, +options.limit, true));
      console.log(total);
      const response = {
        items: data,
        meta: {
          totalItems: +total[0].count,
          itemCount: data.length,
          itemsPerPage: +options.limit,
          totalPages: Math.round(+total[0].count / +options.limit),
          currentPage: +options.page
        }
      }
      return response;
    }

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
      where: query.code
        ? [
            { code: ILike(`%${query.code}%`) },
            { collection: { title: ILike(`%${query.code}%`) } },
            { model: { title: ILike(`%${query.code}%`) } },
          ]
        : {},
    });
  }

  async getOne(id: string) {
    return await this.qrBaseRepository
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

  async getOneCode(code) {
    return await this.qrBaseRepository.find({
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
    });
  }

  async deleteOne(id: string) {
    return await this.qrBaseRepository.delete(id).catch(() => {
      throw new NotFoundException('Qr-code not found');
    });
  }

  async change(value: UpdateQrBaseDto, id: string) {
    return await this.qrBaseRepository
      .createQueryBuilder()
      .update()
      .set(value as unknown as QrBase)
      .where('id = :id', { id })
      .execute();
  }

  async create(value: CreateQrBaseDto) {
    return await this.qrBaseRepository
      .createQueryBuilder()
      .insert()
      .into(QrBase)
      .values(value as unknown as QrBase)
      .returning('id')
      .execute();
  }

  async findOrCreate(codes: CreateQrBaseDto[]) {
    for (const support of codes) {
      if (support.code) {
        const response = await this.qrBaseRepository.findOne({
          where: { code: support.code },
        });
        let data = { ...support };

        if (!response) {
          data.collection = await this.collectionService.findOrCreate(data?.collection?.trim());
          data.country ? (data.country = await this.countryService.findOrCreate(data?.country?.trim())) : (data.country = null);

          data.model
            ? (data.model = await this.modelService.findOrCreate(data?.collection?.trim(), data?.model?.trim()))
            : (data.model = null);
          data.color ? (data.color = await this.colorService.findOrCreate(data?.color?.trim())) : (data.color = null);
          data.shape ? (data.shape = await this.shapeService.findOrCreate(data?.shape?.trim())) : (data.shape = null);
          data.size ? (data.size = await this.sizeService.findOrCreate(data?.size?.trim())) : (data.size = null);
          data.style ? (data.style = await this.styleService.findOrCreate(data?.style?.trim())) : (data.style = null);

          await this.create(data);
        } else {
          data?.collection && (data.collection = await this.collectionService.findOrCreate(data?.collection?.trim()));
          data?.country && (data.country = await this.countryService.findOrCreate(data?.country?.trim()));
          data?.collection &&
            data?.model &&
            (data.model = await this.modelService.findOrCreate(data?.collection?.trim(), data?.model?.trim()));
          data?.color && (data.color = await this.colorService.findOrCreate(data?.color?.trim()));
          data?.shape && (data.shape = await this.shapeService.findOrCreate(data?.shape?.trim()));
          data?.size && (data.size = await this.sizeService.findOrCreate(data?.size?.trim()));
          data?.style && (data.style = await this.styleService.findOrCreate(data?.style?.trim()));

          await this.change(data, response.id);
        }
      }
    }
    return 'created and updated succesfully!';
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
