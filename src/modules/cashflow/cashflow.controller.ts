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
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';

import { CreateCashflowDto, UpdateCashflowDto } from './dto';

import { PaginationDto } from '../../infra/shared/dto';
import { Route } from '../../infra/shared/decorators/route.decorator';
import { CashflowService } from './cashflow.service';
import { Cashflow } from './cashflow.entity';

@ApiTags('Cashflow')
@Controller('cashflow')
export class CashflowController {
  constructor(private readonly cashflowService: CashflowService) {}

  @Get('/')
  @ApiOperation({ summary: 'Method: returns all Cashflows' })
  @ApiOkResponse({
    description: 'The cashflows were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getData(@Route() route: string, @Query() query: PaginationDto) {
    return await this.cashflowService.getAll({ ...query, route });
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns single cashflow by id' })
  @ApiOkResponse({
    description: 'The cashflow was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getMe(@Param('id') id: string): Promise<Cashflow> {
    return this.cashflowService.getOne(id);
  }

  @Post('/')
  @ApiOperation({ summary: 'Method: creates new Cashflow' })
  @ApiCreatedResponse({
    description: 'The cashflow was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData(@Body() data: CreateCashflowDto, @Req() request) {
    return await this.cashflowService.create(data, request.user.id);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Method: updating cashflow' })
  @ApiOkResponse({
    description: 'Cashflow was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeData(
    @Body() data: UpdateCashflowDto,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    return await this.cashflowService.change(data, id);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting cashflow' })
  @ApiOkResponse({
    description: 'Cashflow was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string) {
    return await this.cashflowService.deleteOne(id);
  }
}
