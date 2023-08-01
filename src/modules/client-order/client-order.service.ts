import { NotFoundException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

import { UpdateClientOrderDto, CreateClientOrderDto } from './dto';
import { ClientOrder } from './client-order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductService } from '../product/product.service';
import { UserService } from '../user/user.service';
import { FilialService } from '../filial/filial.service';
import { KassaService } from '../kassa/kassa.service';

@Injectable()
export class ClientOrderService {
  constructor(
    @InjectRepository(ClientOrder)
    private readonly clientOrder: Repository<ClientOrder>,
    private readonly productService: ProductService,
    private readonly userService: UserService,
    private readonly filialService: FilialService,
    private readonly kassaService: KassaService,
  ) {}

  async getAll(options: IPaginationOptions): Promise<Pagination<ClientOrder>> {
    return paginate<ClientOrder>(this.clientOrder, options, {
      relations: {
        product: true,
      },
    });
  }

  async getOne(id: string) {
    const data = await this.clientOrder
      .findOne({
        where: { id },
        relations: { product: true, filial: true },
      })
      .catch(() => {
        throw new NotFoundException('data not found');
      });

    return data;
  }

  async deleteOne(id: string) {
    const response = await this.clientOrder.delete(id).catch(() => {
      throw new NotFoundException('data not found');
    });
    return response;
  }

  async change(value: UpdateClientOrderDto, id: string) {
    const response = await this.clientOrder
      .createQueryBuilder()
      .update()
      .set(value as unknown as ClientOrder)
      .where('id = :id', { id })
      .execute();
    return response;
  }

  async changeIsActive(id: string, isActive: boolean) {
    const response = await this.clientOrder.update({ id }, { isActive });
    return response;
  }

  async checkOrder(id: string) {
    const order = await this.getOne(id);
    const kassa = await this.kassaService.GetOpenKassa(order.filial.id);
  }

  async create(value: CreateClientOrderDto) {
    const user = (await this.userService.getOne(value.user)) || null;
    const filial = (await this.filialService.getOne(value.filial)) || null;
    const order = value.order;
    delete value.order;
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

    return 'ok';
  }

  async getInternetShopSumByRange(where) {
    const data = await this.clientOrder.find({ where });
    const sum = data?.length
      ? data.map((c) => Number(c.totalPrice)).reduce((a, b) => a + b)
      : 0;

    return sum;
  }
}
