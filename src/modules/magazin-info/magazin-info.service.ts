import { NotFoundException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

import { CreateMagazinInfoDto, UpdateMagazinInfoDto } from './dto';
import { MagazinInfo } from './magazin-info.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MagazinInfoService {
  constructor(
    @InjectRepository(MagazinInfo)
    private readonly magazinInfoRepository: Repository<MagazinInfo>,
  ) {}

  async getAll(options: IPaginationOptions): Promise<Pagination<MagazinInfo>> {
    return paginate<MagazinInfo>(this.magazinInfoRepository, options);
  }

  async getOne(id: string) {
    const data = await this.magazinInfoRepository
      .findOne({
        where: { id },
      })
      .catch(() => {
        throw new NotFoundException('data not found');
      });

    return data;
  }

  async deleteOne(id: string) {
    const response = await this.magazinInfoRepository.delete(id).catch(() => {
      throw new NotFoundException('data not found');
    });
    return response;
  }

  async change(value: UpdateMagazinInfoDto, id: string) {
    const response = await this.magazinInfoRepository.update({ id }, value);
    return response;
  }

  async create(value: CreateMagazinInfoDto) {
    const data = this.magazinInfoRepository.create(value);
    return await this.magazinInfoRepository.save(data);
  }
}
