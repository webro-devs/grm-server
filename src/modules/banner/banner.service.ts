import { NotFoundException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { FindOptionsWhere, Repository } from 'typeorm';

import { Banner } from './banner.entity';
import { CreateBannerDto, UpdateBannerDto } from './dto';

Injectable();
export class BannerService {
  constructor(
    @InjectRepository(Banner)
    private readonly bannerRepository: Repository<Banner>,
  ) {}

  async getAll() {
    return await this.bannerRepository.find({
      order: {
        index: 'ASC',
      },
    });
  }

  async getOne(id: string) {
    const data = await this.bannerRepository
      .findOne({
        where: { id },
      })
      .catch(() => {
        throw new NotFoundException('Size not found');
      });

    return data;
  }

  async getOneByName(title: string) {
    const data = await this.bannerRepository
      .findOne({
        where: { title },
      })
      .catch(() => {
        throw new NotFoundException('Size not found');
      });

    return data;
  }

  async deleteOne(id: string) {
    const response = await this.bannerRepository.delete(id).catch(() => {
      throw new NotFoundException('Size not found');
    });
    return response;
  }

  async change(value: UpdateBannerDto, id: string) {
    const response = await this.bannerRepository.update({ id }, value);
    return response;
  }

  async changeAll(value: UpdateBannerDto[]) {
    for (let i = 0; i < value.length; i++) {
      const response = await this.bannerRepository.update({ id: value[i].id }, { index: value[i].index });
    }
    return 'okay';
  }

  async create(value: CreateBannerDto) {
    const data = this.bannerRepository.create(value);
    return await this.bannerRepository.save(data);
  }
}
