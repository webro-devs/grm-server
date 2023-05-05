import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { FindOptionsWhere } from 'typeorm';
import { Filial } from './filial.entity';
import { FilialRepository } from './filial.repository';
import { CreateFilialDto, UpdateFilialDto } from './dto';

Injectable();
export class FilialService {
  constructor(
    @InjectRepository(Filial)
    private readonly filialRepository: FilialRepository,
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

  async getOne(id: string) {
    const data = await this.filialRepository.findOne({
      where: { id },
    });

    if (!data) {
      throw new HttpException('data not found', HttpStatus.NOT_FOUND);
    }

    return data;
  }

  async deleteOne(id: string) {
    const response = await this.filialRepository.delete(id);
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
