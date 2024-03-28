import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { CreateFileDto, UpdateFileDto } from './dto';

import { File } from './file.entity';
import { Repository } from 'typeorm';

Injectable();
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {}

  async create(data: CreateFileDto) {
    const response = this.fileRepository.create(data);

    return await this.fileRepository.save(response);
  }

  async update(data: UpdateFileDto, id: string) {
    return await this.fileRepository.update({ id }, data);
  }

  async delete(id: string) {
    return await this.fileRepository.delete(id).catch(() => {
      throw new NotFoundException('data not found');
    });
  }

  async deleteByUrl(url: string) {
    const file = await this.getByUrl(url);
    return await this.fileRepository.delete(file.id).catch(() => {
      throw new NotFoundException('data not found');
    });
  }

  async getAll(options: IPaginationOptions): Promise<Pagination<File>> {
    return paginate<File>(this.fileRepository, options);
  }

  async getByModel(model: string) {
    return await this.fileRepository.find({ where: { model } });
  }

  async getByUrl(url: string) {
    return await this.fileRepository.findOne({ where: { url } });
  }

  async getByModelAndColor(model: string, color: string, shape: string) {
    return await this.fileRepository.findOne({
      where: { model, color, shape },
    });
  }
}
