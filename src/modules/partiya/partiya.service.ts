import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Partiya } from './partiya.entity';
import { PartiyaRepository } from './partiya.repository';

Injectable();
export class PartiyaService {
  constructor(
    @InjectRepository(Partiya)
    private readonly partiyaRepository: PartiyaRepository,
  ) {}
}
