import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Booking } from './booking.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { User } from '../user/user.entity';
import { ProductService } from '../product/product.service';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly repository: Repository<Booking>,
    private readonly productService: ProductService,
  ) {
  }

  async create(createBooking: CreateBookingDto, user: User) {
    const { product, total } = await this.checkAvailible({
      product_id: createBooking.product,
      count: createBooking.count,
    });
    await this.checkDuplicate({ userId: user.id, productId: createBooking.product });
    const data = this.repository.create({ product: createBooking.product, user: user, count: createBooking.count });
    await this.repository.save(data);
    await this.productService.changeBookCount({ id: product.id, book_count: total });
    return data;
  }

  findAll(options: IPaginationOptions, where?: FindOptionsWhere<Booking>, user?: User) {
    return paginate<Booking>(this.repository, options, {
      order: {
        created_at: 'DESC',
      },
      relations: {
        product: {
          model: { collection: true },
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
    const book = await this.repository.findOne({ where: { id }, relations: { product: true } });
    const total: number = book.product.book_count;
    const count = total - book.count;
    await this.productService.changeBookCount({ id: book.product.id, book_count: count < 0 ? 0 : count });
    return await this.repository.delete(id);
  }

  async checkDuplicate({ userId, productId }) {
    const data = await this.repository.findOne({
      where: {
        product: {
          id: productId,
        },
        user: {
          id: userId,
        },
      },
    });

    if (data)
      throw new BadRequestException('You already book this product.');
  }

  async checkAvailible({ product_id, count }) {
    const product = await this.productService.getOne(product_id);
    const total: number = product.book_count || 0 + count;
    if (product.shape.toLowerCase() === 'rulo' && product.y < total)
      throw new BadRequestException('You can not get this length');
    else if (product.count < total)
      throw new BadRequestException('You can not book');

    return { product, total };
  }
}
