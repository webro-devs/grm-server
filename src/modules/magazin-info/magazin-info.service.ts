import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';

import { CreateMagazinInfoDto, UpdateMagazinInfoDto } from './dto';
import { MagazinInfo } from './magazin-info.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MagazinInfoService {
  constructor(
    @InjectRepository(MagazinInfo)
    private readonly magazineInfoRepository: Repository<MagazinInfo>,
  ) {}

  async getAll(): Promise<MagazinInfo> {
    const shopInfo = (await this.magazineInfoRepository.find())[0]
    delete shopInfo.id
    return shopInfo;
  }

  async getOne(id: string) {
    const data = await this.magazineInfoRepository
      .findOne({
        where: { id },
      })
      .catch(() => {
        throw new NotFoundException('data not found');
      });

    return data;
  }

  async deleteOne(id: string) {
    const response = await this.magazineInfoRepository.delete(id).catch(() => {
      throw new NotFoundException('data not found');
    });
    return response;
  }

  async change(value: UpdateMagazinInfoDto) {
    const magazineInfos = await this.magazineInfoRepository.find()
    return this.magazineInfoRepository.update({ id: magazineInfos[0].id }, value);
  }

  async create(value: CreateMagazinInfoDto) {
    const data = this.magazineInfoRepository.create(value);
    return await this.magazineInfoRepository.save(data);
  }
}
