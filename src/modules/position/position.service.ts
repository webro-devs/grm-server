import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Position } from './position.entity';
import { PositionRepository } from './position.repository';

Injectable();
export class PositionService {
  constructor(
    @InjectRepository(Position)
    private readonly positionRepository: PositionRepository,
  ) {}
}
