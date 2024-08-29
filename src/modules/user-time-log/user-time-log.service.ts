import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserTimeLog } from './user-time-log.entity';
import { UserService } from '../user/user.service';
import { BadRequestException } from '@nestjs/common/exceptions';
import * as bcrypt from 'bcrypt';
import CreateTimeLogDto from './dto/create-time-log.dto';

@Injectable()
export class UserTimeLogService {
  constructor(
    @InjectRepository(UserTimeLog)
    private readonly userTimeLogRepository: Repository<UserTimeLog>,
    private readonly userService: UserService,
  ) {
  }

  async getAll(where) {
    return await this.userTimeLogRepository.find({
      order: {
        enter: 'DESC',
      },
      relations: {
        user: {
          filial: true,
          position: true,
        },
      },
      where,
    });
  }

  async getOne(id: string) {
    return await this.userTimeLogRepository
      .findOne({
        where: { id },
      })
      .catch(() => {
        throw new NotFoundException('Style not found');
      });
  }

  async deleteOne(id: string) {
    return await this.userTimeLogRepository.delete(id).catch(() => {
      throw new NotFoundException('Style not found');
    });
  }

  async change(value, id: string) {
    return await this.userTimeLogRepository.update({ id }, value);
  }

  async create(value: CreateTimeLogDto) {
    const user = await this.userService.getClientBy('username', value.login);
    const check = await this.userTimeLogRepository.findOne({
      where: {
        user: { id: user.id },
      },
    });
    if (!check) {
      if (!value.enter)
        throw new BadRequestException('Leave must be value!');

      const data = this.userTimeLogRepository.create(value);
      await this.userTimeLogRepository.save(data);
    } else {
      if (!value.leave)
        throw new BadRequestException('Leave must be value!');

      await this.userTimeLogRepository.update({ id: check.id }, { leave: value.leave });
    }
  }

  async checkBoss({ login, password }) {
    const user = await this.userService.getByLogin(login);
    if (!user) {
      throw new BadRequestException('Invalid login or password.');
    }
    const isSame = await bcrypt.compare(password, user.password);
    if (!isSame) {
      throw new BadRequestException('Invalid login or password.');
    }
  }
}
