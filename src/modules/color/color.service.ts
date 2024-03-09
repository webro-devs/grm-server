import { NotFoundException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { FindOptionsWhere, Repository } from 'typeorm';

import { Color } from './color.entity';
import { CreateColorDto, UpdateColorDto } from './dto';

Injectable();
export class ColorService {
  constructor(
    @InjectRepository(Color)
    private readonly colorRepository: Repository<Color>,
  ) {}

  async getAll() {
    return await this.colorRepository.find({
      order: {
        title: 'ASC',
      },
    });
  }

  async getOne(id: string, excel = false) {
    if (excel) {
      const data = await this.colorRepository.findOne({
        where: { id },
      });

      return data;
    }
    const data = await this.colorRepository.findOne({
      where: { id },
    });

    return data;
  }

  async getOneByName(title: string) {
    const data = await this.colorRepository
      .findOne({
        where: { title },
      })
      .catch(() => {
        throw new NotFoundException('Color not found');
      });

    return data;
  }

  async deleteOne(id: string) {
    const response = await this.colorRepository.delete(id).catch(() => {
      throw new NotFoundException('Color not found');
    });
    return response;
  }

  async change(value: UpdateColorDto, id: string) {
    const response = await this.colorRepository.update({ id }, value);
    return response;
  }

  async create(value: CreateColorDto) {
    const data = this.colorRepository.create(value);
    return await this.colorRepository.save(data);
  }

  async findOrCreate(title) {
    const response = await this.colorRepository.findOne({
      where: { title },
    });

    if (!response) {
      return (await this.create({ title, code: '#f00000' })).id;
    }
    return response.id;
  }

  async mergeColors() {
    const colors: Color[] = await this.getAll();
    const groupedColors: any[] = this.groupSimilarColors(colors);

    return groupedColors;
  }

  private groupSimilarColors(colors: Color[]): any[] {
    const groupedColorsMap = new Map<string, Color[]>();

    colors.forEach((color) => {
      const key = color.title.toLowerCase();

      if (groupedColorsMap.has(key)) {
        groupedColorsMap.get(key).push(color);
      } else {
        groupedColorsMap.set(key, [color]);
      }
    });

    return Array.from(groupedColorsMap.values());
  }
}
