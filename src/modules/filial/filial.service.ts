import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Filial } from './filial.entity';
import { CreateFilialDto, UpdateFilialDto } from './dto';

Injectable();
export class FilialService {
  constructor(
    @InjectRepository(Filial)
    private readonly filialRepository: Repository<Filial>,
  ) {}

  async getAll(options: IPaginationOptions, where?: FindOptionsWhere<Filial>): Promise<Pagination<Filial>> {
    return paginate<Filial>(this.filialRepository, options, {
      order: {
        title: 'ASC',
      }
    });
  }

  async getAllFilial() {
    const data = await this.filialRepository.find();
    return data;
  }

  async getOne(id: string) {
    const data = await this.filialRepository
      .findOne({
        where: { id },
      })
      .catch(() => {
        throw new NotFoundException('data not found');
      });

    return data;
  }

  async getBaza() {
    const data = await this.filialRepository
      .findOne({
        where: { title: 'baza' },
        relations: { products: { model: true, color: true } },
      })
      .catch(() => {
        throw new NotFoundException('Baza not found');
      });

    return data;
  }

  async deleteOne(id: string) {
    const response = await this.filialRepository.delete(id).catch(() => {
      throw new NotFoundException('data not found');
    });
    return response;
  }

  async change(value: UpdateFilialDto, id: string) {
    const response = await this.filialRepository.update({ id }, value);
    return response;
  }

  async create(value: CreateFilialDto) {
    const data = this.filialRepository.create(value);
    return await this.filialRepository.save(data);
  }

  async findOrCreateFilialByTitle(title: string): Promise<Filial> {
    let response = await this.filialRepository.findOne({ where: { title } });

    if (!response) {
      const data = {
        title,
        address: 'Baza',
        startWorkTime: '00:00',
        endWorkTime: '23:59',
        addressLink: 'https://maps.app.goo.gl/fdoNS4WeGJR7pgJm6',
        landmark: 'Evos',
        phone1: '+99897-777-77-77',
        phone2: '+99898-888-88-88',
      };
      response = this.filialRepository.create(data);
      await this.filialRepository.save(response);
    }

    return response;
  }

  async name() {
    const data = await this.filialRepository.find();

    // @ts-ignore
    data.unshift({ id: 'boss', name: 'Boss' }, { id: 'manager', name: 'Manager' });

    return data;
  }

  async getBazaFor() {
    return await this.filialRepository
      .findOne({
        where: { title: 'baza' },
      });
  }

  async getFilialWithKassa() {
    return this.filialRepository.find({ relations: { kassa: { orders: true } } });
  }
}
