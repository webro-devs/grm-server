// data-sender.service.ts
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import * as cron from 'node-cron';
import { ProductService } from '../product/product.service';
import { telegramSender } from '../../infra/helpers';

@Injectable()
export class DataSenderService implements OnModuleDestroy {
  private scheduledJobs: cron.ScheduledTask[] = [];

  constructor(
    private readonly productService: ProductService,
  ) // private index: number = 1,
  {}

  cronJob({ startTime = '09:00', endTime = '21:00', count = 1 }) {
    // Define the interval for sending data (in minutes)
    const intervalMinutes = 60 / count;

    // Convert start and end time to minutes from midnight
    const startMinutes = this.getTimeInMinutes(startTime);
    const endMinutes = this.getTimeInMinutes(endTime);

    // Schedule the data sending task and store the scheduled jobs
    for (
      let minutes = startMinutes;
      minutes < endMinutes;
      minutes += intervalMinutes
    ) {
      const hour = Math.floor(minutes / 60);
      const minute = minutes % 60;
      const cronExpression = `${minute} ${hour} * * *`; // Minutes Hours * * *
      const job = cron.schedule(cronExpression, () => this.sendData());
      this.scheduledJobs.push(job);
    }
    return 'ok';
  }

  onModuleDestroy() {
    // Stop all the scheduled cron jobs when the module is destroyed
    this.scheduledJobs.forEach((job) => job.stop());
  }

  private getTimeInMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private async sendData() {
    // const products = await this.productService.getAllForTelegraam();
    // if (products.length < this.index) this.index = 1;
    // // Your code to send the data goes here
    // telegramSender({
    //   imgUrl: products[this.index]?.imgUrl,
    //   color: products[this.index]?.color,
    //   model: products[this.index]?.model,
    //   shape: products[this.index]?.shape,
    //   size: products[this.index]?.size,
    // });
    // ++this.index;
  }
}
