import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  HttpException,
  Delete,
  Patch,
  Param,
  Get,
  Query,
  Req,
} from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { ApiCreatedResponse, ApiOkResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { Route } from '../../infra/shared/decorators/route.decorator';
import { PaginationDto } from '../../infra/shared/dto';
import { CreateOrderDto, UpdateOrderDto } from './dto';
import { Order } from './order.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from '../../infra/shared/enum';

@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('/')
  @ApiOperation({ summary: 'Method: returns all orders' })
  @ApiOkResponse({
    description: 'The orders were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getData(@Route() route: string, @Query() query: PaginationDto) {
    return await this.orderService.getAll({ ...query, route });
  }

  @Get('/get-by-user/:id')
  @ApiOperation({ summary: 'Method: returns all orders' })
  @ApiOkResponse({
    description: 'The orders were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getByUser(@Query() query, @Param('id') id: string) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    query.to = !query?.to ? `${year}-${month}-${day}` : query.to;
    return await this.orderService.getByUser(id, query?.from || null, query?.to, query?.collcetion || null);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns single order by id' })
  @ApiOkResponse({
    description: 'The order was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getMe(@Param('id') id: string): Promise<Order> {
    return this.orderService.getById(id);
  }

  @Get('/order-by-kassa/:id')
  @ApiOperation({ summary: 'Method: returns orders by kassa ID' })
  @ApiOkResponse({
    description: 'The order was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getOrderByKassa(@Param('id') id: string) {
    return this.orderService.getByKassa(id);
  }

  @Post('/')
  @ApiOperation({ summary: 'Method: creates new order' })
  @ApiCreatedResponse({
    description: 'The order was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData(@Body() data: CreateOrderDto, @Req() request) {
    return await this.orderService.create(data, request.user.id);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Method: updating order' })
  @ApiOkResponse({
    description: 'Order was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeData(@Body() positionData: UpdateOrderDto, @Param('id') id: string): Promise<UpdateResult> {
    return await this.orderService.change(positionData, id);
  }

  @Patch('/isActive/:id')
  @Roles(UserRoleEnum.BOSS, UserRoleEnum.CASHIER, UserRoleEnum.SUPPER_MANAGER, UserRoleEnum.MANAGER)
  @ApiOperation({ summary: 'Method: updating order' })
  @ApiOkResponse({
    description: 'Order was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeIsActive(@Param('id') id: string, @Req() request): Promise<UpdateResult> {
    return await this.orderService.checkOrder(id, request.user.id);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting order' })
  @ApiOkResponse({
    description: 'Order was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string) {
    return await this.orderService.deleteOne(id);
  }

  @Patch('/reject/:id')
  @ApiOperation({ summary: 'Method: reject order' })
  @ApiOkResponse({
    description: 'Order was rejected',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async reject(@Param('id') id: string) {
    return await this.orderService.rejectOrder(id);
  }

  @Patch('/return/:id')
  @ApiOperation({ summary: 'Method: returns order' })
  @ApiOkResponse({
    description: 'Order was returned',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async returnOrderProduct(@Param('id') id: string, @Req() req) {
    return await this.orderService.returnOrder(id, req.user.id);
  }
}
