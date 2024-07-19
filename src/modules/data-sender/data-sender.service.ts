import { Injectable, Logger } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { ProductService } from '../product/product.service';
import { FilialService } from '../filial/filial.service';
import { MagazinInfoService } from '../magazin-info/magazin-info.service';
import { IncrementService } from '../increment/increment.service';
import { telegramSender } from '../../infra/helpers';

const logging = new Logger('Request Middleware', { timestamp: true });

@Injectable()
export class DataSenderService {
  constructor(
    private readonly productService: ProductService,
    private readonly filialService: FilialService,
    private readonly magazinInfoService: MagazinInfoService,
    private schedulerRegistry: SchedulerRegistry,
    private incrementService: IncrementService,
  ) {}

  @Cron('*/1 * * * *', {
    name: 'notifications',
  })
  async scheduleNotifications() {
    const { start_time, count, end_time, allowed } = await this.magazinInfoService.getAll();
    if (allowed && start_time && end_time) {
      const intervals = this.calculateIntervals(start_time, end_time, count);
      const now = new Date();
      const currentTime = (now.getHours() + 5) * 60 + now.getMinutes();

      for (const time of intervals) {
        if (intervals.length && currentTime === time) {
          await this.sendNotification();
        }
      }
    } else {
      logging.log('Not allowed for telegram sending!');
    }
  }

  private calculateIntervals(from: string, to: string, count: number): number[] {
    const [fromHours, fromMinutes] = from.split(':').map(Number);
    const [toHours, toMinutes] = to.split(':').map(Number);

    const fromTime = fromHours * 60 + fromMinutes;
    const toTime = toHours * 60 + toMinutes;

    const interval = (toTime - fromTime) / (count - 1);
    const intervals = [];

    for (let i = 0; i < count; i++) {
      intervals.push(fromTime + Math.round(i * interval));
    }

    return intervals;
  }

  private async sendNotification() {
    // const products = await this.productService.
    const { index } = await this.incrementService.getIncrement();
    let product = await this.productService.getInternetProductSingle(index);
    if (!product) {
      const restoredIndex = await this.incrementService.restore();
      product = await this.productService.getInternetProductSingle(restoredIndex);
    }
    const { shape, color, model, imgUrl, size, price, style, secondPrice } = product;
    await telegramSender({
      shape,
      color,
      model,
      imgUrl,
      size,
      price: this.priceSplitter(secondPrice || 0) || 0,
      style,
    });
    console.log('Telegram Message sent at', new Date().toLocaleTimeString());
    await this.incrementService.increment()
  }

  priceSplitter(price: number) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
}
