import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Filial } from './filial.entity';
import { CreateFilialDto, UpdateFilialDto } from './dto';

Injectable();
export class FilialService {
  constructor(
    @InjectRepository(Filial)
    private readonly filialRepository: Repository<Filial>,
  ) {}

  async getAll(
    options: IPaginationOptions,
    where?: FindOptionsWhere<Filial>,
  ): Promise<Pagination<Filial>> {
    return paginate<Filial>(this.filialRepository, options, {
      order: {
        title: 'ASC',
      },
    });
  }

  async getAllFilial() {
    const data = await this.filialRepository.find();
    return data;
  }

  async getOne(id: string) {
    const data = await this.filialRepository
      .findOne({
        where: { id },
      })
      .catch(() => {
        throw new NotFoundException('data not found');
      });

    return data;
  }

  async deleteOne(id: string) {
    const response = await this.filialRepository.delete(id).catch(() => {
      throw new NotFoundException('data not found');
    });
    return response;
  }

  async change(value: UpdateFilialDto, id: string) {
    const response = await this.filialRepository.update({ id }, value);
    return response;
  }

  async create(value: CreateFilialDto) {
    const data = this.filialRepository.create(value);
    return await this.filialRepository.save(data);
  }
}
