import { Injectable, NotFoundException } from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserTimeLog } from './user-time-log.entity';
import { UserService } from '../user/user.service';
import { BadRequestException, HttpException } from '@nestjs/common/exceptions';
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
    const user = await this.userService.getClientBy('login', value.login);
    if (!user) {
      throw new HttpException('user not found!', 404);
    }

    const check = await this.userTimeLogRepository.findOne({
      where: {
        user: { id: user.id },
        leave: IsNull(),
      },
    });

    if (!check) {
      const data = this.userTimeLogRepository.create({ enter: new Date(value.date), user });
      await this.userTimeLogRepository.save(data);
    } else {
      const leave = new Date(value.date);
      const enterTime = new Date(check.enter).getTime();
      const leaveTime = new Date(leave).getTime();
      const timeDifference = leaveTime - enterTime;

      await this.userTimeLogRepository.update({ id: check.id }, {
        leave,
        totalTime: +(timeDifference / (1000 * 60 * 60)).toFixed(2),
      });
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
