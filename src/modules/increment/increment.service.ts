import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { Increment } from './increment.entity';

@Injectable()
export class IncrementService {
  constructor(
    @InjectRepository(Increment)
    private readonly incrementRepository: Repository<Increment>,
  ) {
  }

  async getIncrement() {
    const [increment] = await this.incrementRepository.find();

    if (!increment) {
      const request = this.incrementRepository.create();
      return await this.incrementRepository.save(request);
    }

    console.log("returned inc", increment.index);
    return increment;
  }

  async restore() {
    const [increment] = await this.incrementRepository.find();

    if (!increment) {
      const request = this.incrementRepository.create();
      return (await this.incrementRepository.save(request)).index;
    }

    await this.incrementRepository.update(increment.id, {
      index: 0,
    });

    return 0;
  }

  async increment() {
    const [increment] = await this.incrementRepository.find();

    if (!increment) {
      const request = this.incrementRepository.create();
      return (await this.incrementRepository.save(request)).index;
    }

    await this.incrementRepository.update(increment.id, {
      index: increment.index + 1,
    });
    console.log("updated! inc to", increment.index + 1);
  }
}
