import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { ProductQueryDto } from '../../infra/shared/dto';
import { Route } from '../../infra/shared/decorators/route.decorator';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {
  }

  @Post('/')
  async create(@Body() createBookingDto: CreateBookingDto, @Req() req) {
    return await this.bookingService.create(createBookingDto, req.user);
  }

  @Get('/')
  async findAll(@Query() query: ProductQueryDto, @Route() route: string, @Req() req) {
    return await this.bookingService.findAll({ limit: query.limit, page: query.page, route }, req.where, null);
  }

  @Get('/by-user')
  async findAllByUser(@Query() query: ProductQueryDto, @Route() route: string, @Req() req) {
    return await this.bookingService.findAll({ limit: query.limit, page: query.page, route }, req.where, req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(+id, updateBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingService.remove(id);
  }
}
