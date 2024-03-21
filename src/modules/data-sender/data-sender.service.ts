// data-sender.service.ts
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import * as cron from 'node-cron';
import { ProductService } from '../product/product.service';
import { FilialService } from '../filial/filial.service';
import { telegramSender } from '../../infra/helpers';

@Injectable()
export class DataSenderService implements OnModuleDestroy {
  private scheduledJobs: cron.ScheduledTask[] = [];
  index = 0;
  constructor(
    private readonly productService: ProductService,
    private readonly filialService: FilialService,
  ) {}

  cronJob({ startTime = '09:00', endTime = '21:00', count = 1 }) {
    const intervalMinutes = 60 / count;

    const startMinutes = this.getTimeInMinutes(startTime);
    const endMinutes = this.getTimeInMinutes(endTime);

    for (
      let minutes = startMinutes;
      minutes < endMinutes;
      minutes += intervalMinutes
    ) {
      const hour = Math.floor(minutes / 60);
      const minute = minutes % 60;
      const cronExpression = `${minute} ${hour} * * *`;
      const job = cron.schedule(cronExpression, () => this.sendData());
      this.scheduledJobs.push(job);
    }
    return 'ok';
  }

  onModuleDestroy() {
    this.scheduledJobs.forEach((job) => job.stop());
  }

  private getTimeInMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private async sendData() {
    const { products, count } = await this.productService.getAllForTelegram();
    if (count <= this.index) this.index = 0;
    const filial = await this.filialService.getOne(
      products[this.index].filial.id,
    );

    telegramSender({
      imgUrl: products[this.index]?.imgUrl,
      color: products[this.index]?.color,
      model: products[this.index]?.model,
      shape: products[this.index]?.shape,
      size: products[this.index]?.size,
      phone1: filial?.phone1,
      phone2: filial?.phone2,
      address: filial?.address,
      addressLink: filial?.addressLink,
      endWork: filial?.endWorkTime,
      startWork: filial?.startWorkTime,
      title: filial?.title,
      landmark: filial?.landmark,
    });
    ++this.index;
  }
}
