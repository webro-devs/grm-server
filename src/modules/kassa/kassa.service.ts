import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Kassa } from './kassa.entity';
import { KassaRepository } from './kassa.repository';

Injectable();
export class KassaService {
  constructor(
    @InjectRepository(Kassa)
    private readonly kassaRepository: KassaRepository,
  ) {}
}
