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

@Injectable()
export class ClientOrderService {
  constructor(
    @InjectRepository(ClientOrder)
    private readonly clientOrder: Repository<ClientOrder>,
    private readonly productService: ProductService,
    private readonly userService: UserService,
    private readonly filialService: FilialService,
  ) {}

  async getAll(options: IPaginationOptions): Promise<Pagination<ClientOrder>> {
    return paginate<ClientOrder>(this.clientOrder, options, {
      relations: {
        products: true,
      },
    });
  }

  async getOne(id: string) {
    const data = await this.clientOrder
      .findOne({
        where: { id },
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

  async changeIsActive(id:string,isActive:boolean){
    const response = await this.clientOrder.update({id},{isActive})
    return response
  }

  async create(value: CreateClientOrderDto) {
    const user = (await this.userService.getOne(value.user)) || null;
    const filial = (await this.filialService.getOne(value.filial)) || null;
    const products =
      (await this.productService.getMoreByIds(value.order.map((o) => o.id))) ||
      null;
    let count = {};
    for (let order of value.order) {
      count[order.id] = order.count;
    }
    delete value.order;
    const data = this.clientOrder.create({
      ...value,
      user,
      filial,
      products,
      count,
    });

    return await this.clientOrder.save(data);
  }
}
