import { Controller, Post, Body, HttpCode, HttpStatus, Delete, Patch, Param, Get, Query, Req } from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { ApiCreatedResponse, ApiOkResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { TransferService } from './transfer.service';
import { Route } from '../../infra/shared/decorators/route.decorator';
import { PaginationDto, TransferQueryDto } from '../../infra/shared/dto';
import { CreateTransferDto, UpdateTransferDto } from './dto';
import { Transfer } from './transfer.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from '../../infra/shared/enum';

@ApiTags('Transfer')
@Controller('transfer')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Get('/')
  @ApiOperation({ summary: 'Method: returns all transfers' })
  @ApiOkResponse({
    description: 'The transfers were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getData(@Route() route: string, @Query() query: TransferQueryDto, @Req() req) {
    return await this.transferService.getAll({ limit: query.limit, page: query.page, route }, req.where);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns single transfer by id' })
  @ApiOkResponse({
    description: 'The transfer was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getMe(@Param('id') id: string): Promise<Transfer> {
    return this.transferService.getById(id);
  }

  @Post('/')
  @ApiOperation({ summary: 'Method: creates new transfer' })
  @ApiCreatedResponse({
    description: 'The transfer was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData(@Body() data: CreateTransferDto[], @Req() request) {
    return await this.transferService.create(data, request.user.id);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Method: updating transfer' })
  @ApiOkResponse({
    description: 'Transfer was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeData(@Body() data: UpdateTransferDto, @Param('id') id: string): Promise<UpdateResult> {
    return await this.transferService.change(data, id);
  }

  @Roles(UserRoleEnum.CASHIER, UserRoleEnum.MANAGER, UserRoleEnum.BOSS)
  @Patch('/accept/:id')
  @ApiOperation({ summary: 'Method: checking transfer' })
  @ApiOkResponse({
    description: 'Transfer was accepted by cashier',
  })
  @HttpCode(HttpStatus.OK)
  async checkTransfer(@Param('id') id: string, @Req() req) {
    return await this.transferService.checkTransfer(id, req.user.id);
  }

  @Roles(UserRoleEnum.CASHIER, UserRoleEnum.MANAGER, UserRoleEnum.BOSS)
  @Patch('/reject/:id')
  @ApiOperation({ summary: 'Method: reject transfer' })
  @ApiOkResponse({
    description: 'Transfer was rejected by cashier',
  })
  @HttpCode(HttpStatus.OK)
  async rejectTransfer(@Param('id') id: string, @Req() req) {
    return await this.transferService.rejectProduct(id, req.user.id);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting transfer' })
  @ApiOkResponse({
    description: 'Transfer was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string, @Req() req) {
    await this.transferService.rejectProduct(id, req.user.id);
    return await this.transferService.deleteOne(id);
  }
}
