import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CreateMagazinInfoDto, UpdateMagazinInfoDto } from './dto';
import { MagazinInfo } from './magazin-info.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSenderService } from '../data-sender/data-sender.service';
import * as process from 'process';

@Injectable()
export class MagazinInfoService {
  constructor(
    @InjectRepository(MagazinInfo)
    private readonly magazineInfoRepository: Repository<MagazinInfo>,
    private readonly dataSenderService: DataSenderService,
  ) {
  }

  async getAll(): Promise<MagazinInfo> {
    const shopInfo = await this.magazineInfoRepository.find();
    if (!shopInfo.length) {
      const data = { terms: null, availability: null, end_time: null, start_time: null, count: 0, allowed: false };
      const res = await this.create(data);
      delete res.id;

      return res;
    }
    delete shopInfo[0].id;
    return shopInfo[0];
  }

  async getOne(id: string) {
    return await this.magazineInfoRepository
      .findOne({
        where: { id },
      })
      .catch(() => {
        throw new NotFoundException('data not found');
      });
  }

  async deleteOne(id: string) {
    return await this.magazineInfoRepository.delete(id).catch(() => {
      throw new NotFoundException('data not found');
    });
  }

  async change(value: UpdateMagazinInfoDto) {
    const magazineInfos = await this.magazineInfoRepository.find();
    if (value.allowed == true && process.env?.TYPE == 'production' && !magazineInfos[0].allowed) {
      this.dataSenderService.cronJob({
        startTime: value.start_time,
        endTime: value.end_time,
        count: value.count,
      });
    }else if((value.allowed == false || process.env?.TYPE == 'test') && magazineInfos[0].allowed){
      this.dataSenderService.onModuleDestroy()
    }
    return this.magazineInfoRepository.update({ id: magazineInfos[0].id }, value);
  }

  async create(value: CreateMagazinInfoDto) {
    const data = this.magazineInfoRepository.create(value);
    return await this.magazineInfoRepository.save(data);
  }
}
