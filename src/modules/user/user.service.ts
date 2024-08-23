import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { promisify } from 'util';
import { exec } from 'child_process';

import * as shell from 'shelljs';
import * as path from 'path';

import { User } from './user.entity';
import { CreateClientDto, CreateUserDto, UpdateClientDto, UpdateUserDto } from './dto';
import { hashPassword, idGenerator } from 'src/infra/helpers';
import { FilialService } from '../filial/filial.service';
import { PositionService } from '../position/position.service';
import { UserRoleEnum } from '../../infra/shared/enum';
import { ProductService } from '../product/product.service';
import { ActionService } from '../action/action.service';

Injectable();
export class UserService {
  private backupDir = 'backup';
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly filialService: FilialService,
    private readonly positionService: PositionService,
    private readonly productService: ProductService,
    private readonly actionService: ActionService,
  ) {}

  async getAll(options: IPaginationOptions, where): Promise<Pagination<User>> {
    return paginate<User>(this.userRepository, options, {
      order: {
        firstName: 'ASC',
      },
      relations: {
        position: true,
        filial: true,
      },
      where: {
        role: MoreThan(0),
        filial: { isActive: true },
        ...(where.role && { position: { id: where.role } }),
        ...(where.filial && { filial: { id: where.filial, isActive: true } }),
      },
    });
  }

  async getByLogin(login: string) {
    const data = await this.userRepository.findOne({
      where: { login },
      relations: { filial: true, position: true },
    });

    return data;
  }

  async getClientById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        clientOrders: true,
        favoriteProducts: {
          model: {
            collection: true,
          },
        },
      },
    });

    return user;
  }

  async getUsersWithSelling(id: string) {
    const data = await this.userRepository.find({
      where: { filial: { id } },
      relations: { sellerOrders: true },
    });
    return data;
  }

  async getUsersWithSellingWithOrder(id: string) {
    const users = await this.userRepository.find({
      relations: { sellerOrders: { product: { color: true } }, filial: true, position: true },
      where: { filial: { id }, role: 1 },
    });

    for (const user of users) {
      user['sellerOrdersCount'] = user.sellerOrders.length;
      delete user.password;
      delete user.login;
    }

    return users
      .sort((a, b) => b['sellerOrdersCount'] - a['sellerOrdersCount'])
      .splice(0, 11)
      .map((obj, index) => ({ ...obj, index: index + 1 }));
  }

  async getOne(id: string, from?: Date, to?: Date, collection?: String) {
    const data = await this.userRepository
      .findOne({
        where: {
          id,
        },
        relations: {
          position: true,
          filial: true,
        },
      })
      .catch(() => {
        throw new NotFoundException('User not found');
      });

    return data;
  }

  async addFavoriteProduct(userId: string, productId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { favoriteProducts: true },
    });
    const product = await this.productService.getOne(productId);
    user.favoriteProducts.push(product);
    await this.userRepository.save(user);
    return user;
  }

  async removeFavoriteProduct(userId: string, productId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { favoriteProducts: true },
    });
    user.favoriteProducts = user.favoriteProducts.length ? user.favoriteProducts.filter((p) => p.id != productId) : [];
    await this.userRepository.save(user);
    return user;
  }

  async deleteOne(id: string) {
    const response = await this.userRepository.delete(id).catch(() => {
      throw new NotFoundException('data not found');
    });
    return response;
  }

  async change(value: UpdateUserDto, id: string) {
    if (value.login) {
      value.password = await hashPassword(value.login);
    }
    return await this.userRepository
      .createQueryBuilder()
      .update()
      .set(value as unknown as User)
      .where('id = :id', { id })
      .execute();
  }

  async create(data: CreateUserDto, user) {
    const login = idGenerator();
    const filial = data.filial ? await this.filialService.getOne(data.filial) : null;
    let user_infos = '';
    if (data.role == UserRoleEnum.SELLER) {
      user_infos = 'продавец для флиала';
    } else if (data.role == UserRoleEnum.CASHIER) {
      user_infos = 'кассир для флиала';
    } else if (data.role == UserRoleEnum.SUPPER_MANAGER) {
      user_infos = 'i-manager для';
    }

    await this.actionService.create(data, user.id, data.filial, 'user_create', `${user_infos} ${filial.title}`);
    const position = await this.positionService.getOne(data.position);
    const password = await hashPassword(login);
    const _user = this.userRepository.create({
      ...data,
      login,
      filial,
      position,
      password,
    });

    const _User = await this.userRepository.save(_user);
    return _User;
  }

  async createClient(data: CreateClientDto) {
    data.password = await hashPassword(data.password);
    const user = this.userRepository.create({
      ...data,
      role: UserRoleEnum.CLIENT,
    });
    return await this.userRepository.save(user);
  }

  async updateClient(id: string, value: UpdateClientDto) {
    const response = await this.userRepository.update({ id }, { ...value });
    return response;
  }

  async createBackup(): Promise<string> {
    const execAsync = promisify(exec);
    const username = process.env.DB_USERNAME;
    const password = process.env.DB_PASSWORD;
    const database = process.env.DB_NAME;
    const backupDir = this.backupDir;
    const backupPath = path.join(backupDir, 'backup.sql');
    const tarFilePath = path.join(backupDir, 'backup.tar');

    const env = { PGPASSWORD: password };

    const pgDumpCommand = [
      'pg_dump',
      `--username=${username}`,
      `--dbname=${database}`,
      `--file=${backupPath}`,
      '--no-owner',
      '--password',
    ];

    shell.mkdir('-p', backupDir);

    try {
      // Execute pg_dump command
      await execAsync(pgDumpCommand.join(' '), { env });

      // Create a tar file from the SQL dump
      await execAsync(`tar -cvf ${tarFilePath} -C ${backupDir} backup.sql`);

      console.log('Backup created successfully');
      return tarFilePath;
    } catch (error) {
      console.error(`Backup failed: ${error.message}`);
      throw error;
    }
  }

  async getUsersHook() {
    return await this.userRepository.find({
      relations: {
        position: true,
      },
    });
  }

  deleteBackup(backupFilePath: string): void {
    shell.rm(backupFilePath);
  }
}
