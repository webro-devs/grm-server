import { NotFoundException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

import { UpdateClientRequestDto, CreateClientRequestDto } from './dto';
import { ClientRequest } from './client-request.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ClientRequestService {
  constructor(
    @InjectRepository(ClientRequest)
    private readonly clientRequest: Repository<ClientRequest>,
  ) {}

  async getAll(
    options: IPaginationOptions,
  ): Promise<Pagination<ClientRequest>> {
    return paginate<ClientRequest>(this.clientRequest, options);
  }

  async getOne(id: string) {
    const data = await this.clientRequest
      .findOne({
        where: { id },
      })
      .catch(() => {
        throw new NotFoundException('data not found');
      });

    return data;
  }

  async deleteOne(id: string) {
    const response = await this.clientRequest.delete(id).catch(() => {
      throw new NotFoundException('data not found');
    });
    return response;
  }

  async change(value: UpdateClientRequestDto, id: string) {
    const response = await this.clientRequest.update({ id }, value);
    return response;
  }

  async create(value: CreateClientRequestDto) {
    const data = this.clientRequest.create(value);
    return await this.clientRequest.save(data);
  }
}
