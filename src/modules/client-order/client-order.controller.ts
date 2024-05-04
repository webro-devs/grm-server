import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateClientOrderDto, UpdateClientOrderDto } from './dto';
import { ClientOrder } from './client-order.entity';
import { ClientOrderService } from './client-order.service';
import { PaginationDto } from '../../infra/shared/dto';
import { Route } from '../../infra/shared/decorators/route.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from '../../infra/shared/enum';
import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';

@ApiTags('Client-Order')
@Controller('client-order')
export class ClientOrderController {
  constructor(
    private readonly clientRequestService: ClientOrderService,
  ) {
  }

  @Get('/')
  @ApiOperation({ summary: 'Method: returns all client order' })
  @ApiOkResponse({
    description: 'The client order were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getData(@Route() route: string, @Query() query: PaginationDto) {
    return await this.clientRequestService.getAll({ ...query, route });
  }

  @Roles(UserRoleEnum.CLIENT)
  @Get('/my-orders')
  @ApiOperation({ summary: 'Method: returns single client order by id' })
  @ApiOkResponse({
    description: 'The client order was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getMyOrders(@Req() req: { user: { id: string } }, @Query() query): Promise<Pagination<ClientOrder, IPaginationMeta>> {
    return await this.clientRequestService.getMyOrders(req.user.id, Number(query?.limit || 20), Number( query?.page || 1));
  }

  @Public()
  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns single client order by id' })
  @ApiOkResponse({
    description: 'The client order was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getMe(@Param('id') id: string): Promise<ClientOrder> {
    return this.clientRequestService.getOne(id);
  }

  @Get('/my-orders/:id')
  @ApiOperation({ summary: 'Method: returns single client order by id' })
  @ApiOkResponse({
    description: 'The client order was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getMyOrder(@Param('id') id: string): Promise<ClientOrder> {
    return this.clientRequestService.getOne(id);
  }

  @Post('/')
  @ApiOperation({ summary: 'Method: creates new client order' })
  @ApiCreatedResponse({
    description: 'The client order was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData(@Body() data: CreateClientOrderDto, @Req() req: any) {
    await this.clientRequestService.create(data, req.user);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Method: updating client order' })
  @ApiOkResponse({
    description: 'Order request was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeData(
    @Body() data: UpdateClientOrderDto,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    return await this.clientRequestService.change(data, id);
  }

  @Patch('/is-active/:id')
  @ApiOperation({ summary: 'Method: updating client order isActive' })
  @ApiOkResponse({
    description: 'Client order isActive property was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeIsActive(
    @Body() { isActive },
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    return await this.clientRequestService.changeIsActive(id, isActive);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting order request' })
  @ApiOkResponse({
    description: 'Order request was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string) {
    return await this.clientRequestService.deleteOne(id);
  }
}
