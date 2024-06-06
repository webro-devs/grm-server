import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';

import { CreateClientOrderDto, UpdateClientOrderDto } from './dto';
import { ClientOrder } from './client-order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductService } from '../product/product.service';
import { FilialService } from '../filial/filial.service';
import { KassaService } from '../kassa/kassa.service';

@Injectable()
export class ClientOrderService {
  constructor(
    @InjectRepository(ClientOrder)
    private readonly clientOrder: Repository<ClientOrder>,
    private readonly productService: ProductService,
    private readonly filialService: FilialService,
    private readonly kassaService: KassaService,
  ) {}

  async getAll(options: IPaginationOptions): Promise<Pagination<ClientOrder>> {
    return paginate<ClientOrder>(this.clientOrder, options, {
      relations: {
        product: { model: { collection: true }, color: true },
      },
      order: {
        startDate: 'DESC'
      }
    });
  }

  async getOne(id: string) {
    const data = await this.clientOrder
      .findOne({
        where: { id },
        relations: { product: { model: { collection: true }, color: true }, filial: true },
      })
      .catch(() => {
        throw new NotFoundException('data not found');
      });

    return data;
  }

  async getMyOrders(id: string, limit: number = 20, page: number = 0) {
    return paginate<ClientOrder>(this.clientOrder, { page: page, limit }, {
      relations: { product: { model: { collection: true }, color: true, partiya: true }, user: true, filial: true },
      where: { user: { id } },
      order: { startDate: 'DESC' },
    });
  }

  async deleteOne(id: string) {
    return await this.clientOrder.delete(id).catch(() => {
      throw new NotFoundException('data not found');
    });
  }

  async change(value: UpdateClientOrderDto, id: string) {
    return await this.clientOrder
      .createQueryBuilder()
      .update()
      .set(value as unknown as ClientOrder)
      .where('id = :id', { id })
      .execute();
  }

  async changeIsActive(id: string, isActive: boolean) {
    const [cOrder] = await this.clientOrder.find({where: { id }});
    if(!cOrder){
      throw new BadRequestException('Order not found!');
    }
    if(cOrder.isActive){
      throw new BadRequestException("Order accepted. You can't change it!");
    }
    return await this.clientOrder.update({ id }, { isActive });
  }
  async create(value: CreateClientOrderDto, user: undefined) {
    const filial = (await this.filialService.getIDokon()) || null;
    const order = value.order;
    delete value.order;

    for await (const o of order) {
      const product = await this.productService.getOne(o.id);
      if(product.count < o.count){
        throw new BadRequestException('Not enough product!');
      }
    }

    await Promise.all(
      order.map(async (o) => {
        const product = await this.productService.getOne(o.id);
        const count = o.count;
        const data = this.clientOrder.create({
          ...value,
          user,
          filial,
          product,
          count,
        });

        await this.clientOrder.save(data);
      }),
    );

    return 'Order Sending to Admin. We will connect with you soon as possible fast.';
  }

  async getInternetShopSumByRange(where) {
    const data = await this.clientOrder.find({ where });
    return data?.length
      ? data.map((c) => Number(c.totalPrice)).reduce((a, b) => a + b)
      : 0;
  }
}
