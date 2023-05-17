import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOptionsWhere, EntityManager } from 'typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { CreateUserDto, UpdateUserDto } from './dto';
import { generateId } from 'src/infra/helpers';
import { FilialService } from '../filial/filial.service';
import { PositionService } from '../position/position.service';

Injectable();
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    private readonly filialService: FilialService,
    private readonly connection: DataSource,
    private readonly positionService: PositionService,
  ) {}

  async getAll(
    options: IPaginationOptions,
    where?: FindOptionsWhere<User>,
  ): Promise<Pagination<User>> {
    return paginate<User>(this.userRepository, options, {
      order: {
        fullName: 'ASC',
      },
    });
  }

  async getByLogin(login: string) {
    const data = await this.userRepository.findOne({ where: { login } });
    if (!data) {
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    }
    return data;
  }

  async getUsersWithSelling(id: string) {
    const data = await this.userRepository.find({
      where: { filial: { id } },
      relations: { sellerOrders: true },
    });
    return data;
  }

  async getOne(id: string) {
    const data = await this.userRepository.findOne({
      where: { id },
    });

    if (!data) {
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    }

    return data;
  }

  async deleteOne(id: string) {
    const response = await this.userRepository.delete(id);
    return response;
  }

  async change(value: UpdateUserDto, id: string) {
    const response = await this.userRepository
      .createQueryBuilder()
      .update()
      .set(value as unknown as User)
      .where('id = :id', { id })
      .execute();
    return response;
  }

  async create(data: CreateUserDto) {
    const user = new User();
    user.login = generateId();
    user.role = data.role;
    user.filial = await this.filialService.getOne(data.filial);
    user.position = await this.positionService.getOne(data.position);
    await user.hashPassword(user.login);
    await this.connection.transaction(async (manager: EntityManager) => {
      await manager.save(user);
    });
    return user.login;
  }
}
