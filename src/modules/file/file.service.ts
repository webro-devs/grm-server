import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FileEntity } from './file.entity';
import { FileRepository } from './file.repository';

Injectable();
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: FileRepository,
  ) {}
}
