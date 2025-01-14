import { Injectable, NotFoundException } from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserTimeLog } from './user-time-log.entity';
import { UserService } from '../user/user.service';
import { BadRequestException, HttpException } from '@nestjs/common/exceptions';
import * as bcrypt from 'bcrypt';
import CreateTimeLogDto from './dto/create-time-log.dto';
import { Cron } from '@nestjs/schedule';

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
      const hours = Math.floor(timeDifference / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

      +minutes > 1 && await this.userTimeLogRepository.update({ id: check.id }, {
        leave,
        totalTime: Number(`${hours}.${minutes < 10 ? '0': ''}${minutes}`),
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

  @Cron('0 20 * * *', {
    name: 'userLogs',
  })
  async closeAtEightCron() {
    const query = () => `
UPDATE "userTimeLog"
SET
    leave = NOW(),  -- Set the leave time to the current timestamp
    "totalTime" = FLOOR(EXTRACT(epoch FROM age(NOW(), enter)) / 3600) +  -- Hours part
                (FLOOR((EXTRACT(epoch FROM age(NOW(), enter)) % 3600) / 60) / 100.0)  -- Minutes part as decimal
WHERE leave is null;
`;
    const data = await this.userTimeLogRepository.query(query());
    console.log(data);
  }

  async createLog(body: { event_log: string }) {
    const { event_log } = body;
    const data = JSON.parse(event_log);
    const event = data?.['AccessControllerEvent'];
    if (event?.['currentVerifyMode'] === 'faceOrPw' && event?.['employeeNoString']) {
      const bodyContent = {
        login: '#' + event?.['employeeNoString'],
        date: data.dateTime,
      };
      try {
        console.log(bodyContent);
        await this.create(bodyContent);
      } catch (e) {
        console.log(e);
      }
      return 'ok';
    }
    return 'ok';
  }
}
