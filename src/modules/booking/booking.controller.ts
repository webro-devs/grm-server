import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { ProductQueryDto } from '../../infra/shared/dto';
import { Route } from '../../infra/shared/decorators/route.decorator';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Booking')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {
  }

  @Post('/')
  @ApiOperation({ summary: 'Method: creates new data' })
  @ApiCreatedResponse({
    description: 'The cashflow was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createBookingDto: CreateBookingDto, @Req() req) {
    return await this.bookingService.create(createBookingDto, req.user);
  }

  @Get('/')
  @ApiOperation({ summary: 'Method: returns all data' })
  @ApiOkResponse({
    description: 'The data were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: ProductQueryDto, @Route() route: string, @Req() req) {
    return await this.bookingService.findAll({ limit: query.limit, page: query.page, route }, req.where, null);
  }

  @Get('/by-user')
  @ApiOperation({ summary: 'Method: returns all data' })
  @ApiOkResponse({
    description: 'The data were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async findAllByUser(@Query() query: ProductQueryDto, @Route() route: string, @Req() req) {
    return await this.bookingService.findAll({ limit: query.limit, page: query.page, route }, req.where, req?.user);
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
