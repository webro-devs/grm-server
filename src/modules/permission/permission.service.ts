import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { FindOptionsWhere } from 'typeorm';
import { CreatePermissionDto, UpdatePermissionDto } from './dto';

import { Permission } from './permission.entity';
import { PermissionRepository } from './permission.repository';

Injectable();
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: PermissionRepository,
  ) { }

  async getAll(
    options: IPaginationOptions,
    where?: FindOptionsWhere<Permission>,
  ): Promise<Pagination<Permission>> {
    return paginate<Permission>(this.permissionRepository, options, {
      order: {
        title: 'ASC',
      },
    });
  }

  async getOne(id: string) {
    const data = await this.permissionRepository.findOne({
      // relations: {
      //   users: {},
      // },
      where: { id },
    });

    if (!data) {
      throw new HttpException('data not found', HttpStatus.NOT_FOUND);
    }

    return data;
  }

  async deleteOne(id: string) {
    const response = await this.permissionRepository.delete(id);
    return response;
  }

  async change(value: UpdatePermissionDto, id: string) {
    const response = await this.permissionRepository.update({ id }, value);
    return response;
  }

  async create(value: CreatePermissionDto) {
    const data = this.permissionRepository.create(value);
    return await this.permissionRepository.save(data);
  }

}
