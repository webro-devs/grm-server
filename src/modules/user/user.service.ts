import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere } from 'typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { CreateUserDto, UpdateUserDto } from './dto';

Injectable();
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
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

  async create(value: CreateUserDto) {
    const data = this.userRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(value as unknown as User)
      .returning('id')
      .execute();
    return data;
  }
}
