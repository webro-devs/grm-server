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
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';
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
    try {
      return await this.orderService.getAll({ ...query, route });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
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

  @Post('/')
  @ApiOperation({ summary: 'Method: creates new order' })
  @ApiCreatedResponse({
    description: 'The order was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData(@Body() data: CreateOrderDto, @Req() request) {
    try {
      return await this.orderService.create(data, request.user.id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Method: updating order' })
  @ApiOkResponse({
    description: 'Order was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeData(
    @Body() positionData: UpdateOrderDto,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    try {
      return await this.orderService.change(positionData, id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch('/isActive/:id')
  @Roles(
    UserRoleEnum.BOSS,
    UserRoleEnum.CASHIER,
    UserRoleEnum.SUPPER_MANAGER,
    UserRoleEnum.MANAGER,
  )
  @ApiOperation({ summary: 'Method: updating order' })
  @ApiOkResponse({
    description: 'Order was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeIsActive(
    @Param('id') id: string,
    @Req() request,
  ): Promise<UpdateResult> {
    try {
      return await this.orderService.checkOrder(id, request.user.id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting order' })
  @ApiOkResponse({
    description: 'Order was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string) {
    try {
      return await this.orderService.deleteOne(id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Method: reject order' })
  @ApiOkResponse({
    description: 'Order was rejected',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async reject(@Param('id') id: string) {
    try {
      return await this.orderService.rejectOrder(id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
