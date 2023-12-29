import { NotFoundException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { FindOptionsWhere, Repository } from 'typeorm';

import { Palette } from './platte.entity';
import { CreatePlatteDto, UpdatePlatteDto } from './dto';

Injectable();
export class PlatteService {
  constructor(
    @InjectRepository(Palette)
    private readonly paletteRepository: Repository<Palette>,
  ) {}

  async getAll() {
    return await this.paletteRepository.find({
      order: {
        title: 'ASC',
      },
    });
  }

  async getOne(id: string) {
    const data = await this.paletteRepository
      .findOne({
        where: { id },
      })
      .catch(() => {
        throw new NotFoundException('Palette not found');
      });

    return data;
  }

  async getOneByName(title: string) {
    const data = await this.paletteRepository
      .findOne({
        where: { title },
      })
      .catch(() => {
        throw new NotFoundException('Palette not found');
      });

    return data;
  }

  async deleteOne(id: string) {
    const response = await this.paletteRepository.delete(id).catch(() => {
      throw new NotFoundException('Palette not found');
    });
    return response;
  }

  async change(value: UpdatePlatteDto, id: string) {
    const response = await this.paletteRepository.update({ id }, value);
    return response;
  }

  async create(value: CreatePlatteDto) {
    const data = this.paletteRepository.create(value);
    return await this.paletteRepository.save(data);
  }

  async findOrCreate(title) {
    const response = await this.paletteRepository.findOne({
      where: { title },
    });

    if (!response) {
      return (await this.create(title)).id;
    }
    return response.id;
  }
}
