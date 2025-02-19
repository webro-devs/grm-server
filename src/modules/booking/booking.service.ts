import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Booking } from './booking.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { User } from '../user/user.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly repository: Repository<Booking>,
  ) {
  }

  async create(createBooking: CreateBookingDto, user: User) {
    const data = this.repository.create({ product: createBooking.product, user: user, count: createBooking.count });
    await this.repository.save(data);
    return data;
  }

  findAll(options: IPaginationOptions, where?: FindOptionsWhere<Booking>, user?: User) {
    return paginate<Booking>(this.repository, options, {
      order: {
        created_at: 'DESC',
      },
      relations: {
        product: {
          model: true,
          color: true,
          filial: true,
        },
      },
      where: {
        ...where,
        ...(user && {
          user: {
            id: user.id,
          },
        }),
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} booking`;
  }

  update(id: number, updateBookingDto: UpdateBookingDto) {
    return `This action updates a #${id} booking`;
  }

  async remove(id: string) {
    return await this.repository.delete(id);
  }
}
