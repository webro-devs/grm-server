import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { CreateFileDto, UpdateFileDto } from './dto';

import { File } from './file.entity';
import { FileRepository } from './file.repository';

Injectable();
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: FileRepository,
  ) {}

  async create(data: CreateFileDto) {
    const response = this.fileRepository.create(data);

    return await this.fileRepository.save(response);
  }

  async update(data: UpdateFileDto, id: string) {
    const response = await this.fileRepository.update({ id }, data);

    return response;
  }

  async delete(id: string) {
    const response = await this.fileRepository.delete(id);

    return response;
  }

  async getAll(options: IPaginationOptions): Promise<Pagination<File>> {
    return paginate<File>(this.fileRepository, options);
  }

  async getByModel(model: string) {
    const response = await this.fileRepository.find({ where: { model } });

    return response;
  }

  async getByModelAndColor(model: string, color: string) {
    const response = await this.fileRepository.findOne({
      where: { model, color },
    });

    return response;
  }
}
