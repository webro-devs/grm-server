import { Injectable, NotFoundException } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';

import { CreateStyleDto, UpdateStyleDto } from './dto';
import { Style } from './style.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StyleService {
  constructor(
    @InjectRepository(Style)
    private readonly styleRepository: Repository<Style>,
  ) {}

  async getAll() {
    return await this.styleRepository.find({
      order: {
        title: 'ASC',
      },
    });
  }

  async getOne(id: string) {
    const data = await this.styleRepository
      .findOne({
        where: { id },
      })
      .catch(() => {
        throw new NotFoundException('Style not found');
      });

    return data;
  }

  async getOneByName(title: string) {
    const data = await this.styleRepository
      .findOne({
        where: { title: ILike(title) },
      })
      .catch(() => {
        throw new NotFoundException('Style not found');
      });

    return data;
  }

  async deleteOne(id: string) {
    const response = await this.styleRepository.delete(id).catch(() => {
      throw new NotFoundException('Style not found');
    });
    return response;
  }

  async change(value: UpdateStyleDto, id: string) {
    const response = await this.styleRepository.update({ id }, value);
    return response;
  }

  async create(value: CreateStyleDto) {
    const data = this.styleRepository.create(value);
    return await this.styleRepository.save(data);
  }

  async findOrCreate(title) {
    const response = await this.styleRepository.findOne({
      where: { title },
    });

    if (!response) {
      return (await this.create({ title })).id;
    }
    return response.id;
  }
}
