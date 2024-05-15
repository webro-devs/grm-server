import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, Req } from '@nestjs/common';
import { OrderBasketService } from './order-basket.service';
import { OrderBasket } from './order-basket.entity';
import { createOrderBasketDto, orderBasketQueryDto, orderBasketUpdateDto } from './dto';
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';
import { Put } from '@nestjs/common/decorators';

@ApiTags('Order-Basket')
@Controller('order-basket')
export class OrderBasketController {
  constructor(private readonly orderBasketService: OrderBasketService) {
  }

  @Get('/')
  @ApiOperation({ summary: 'Method: returns all order baskets' })
  @ApiOkResponse({
    description: 'The order baskets were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async get(@Req() request: Request, @Query() query: orderBasketQueryDto): Promise<Pagination<OrderBasket>> {
    return await this.orderBasketService.find(request['user'], query);
  }

  @Post('/')
  @ApiOperation({ summary: 'Method: create new order basket.' })
  @ApiOkResponse({ description: 'The order baskets were returned successfully' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() values: createOrderBasketDto, @Req() request: Request): Promise<InsertResult> {
    return { generatedMaps: [], identifiers: [], raw: await this.orderBasketService.create(values, request['user']) };
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Method: delete order basket.' })
  @ApiOkResponse({ description: 'The order baskets were deleted successfully' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.orderBasketService.delete(id);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Method: update new order basket.' })
  @ApiOkResponse({ description: 'The order baskets were updated successfully' })
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() body: orderBasketUpdateDto): Promise<UpdateResult> {
    return await this.orderBasketService.update(id, body);
  }
}