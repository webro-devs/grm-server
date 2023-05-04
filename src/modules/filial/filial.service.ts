import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Filial } from './filial.entity';
import { FilialRepository } from './filial.repository';

Injectable();
export class FilialService {
  constructor(
    @InjectRepository(Filial)
    private readonly filialRepository: FilialRepository,
  ) {}
}
