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

  // @Public()
  @Get('/')
  @ApiOperation({ summary: 'Method: returns all Permission' })
  @ApiOkResponse({
    description: 'The permission were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getData(@Route() route: string, @Query() query: PaginationDto) {
    try {
      return await this.cashflowService.getAll({ ...query, route });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // @Public()
  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns single permission by id' })
  @ApiOkResponse({
    description: 'The permission was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getMe(@Param('id') id: string): Promise<Cashflow> {
    return this.cashflowService.getOne(id);
  }

  @Post('/')
  @ApiOperation({ summary: 'Method: creates new Permission' })
  @ApiCreatedResponse({
    description: 'The permission was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData(@Body() data: CreateCashflowDto): Promise<Cashflow> {
    try {
      return await this.cashflowService.create(data);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Method: updating permission' })
  @ApiOkResponse({
    description: 'Permission was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeData(
    @Body() data: UpdateCashflowDto,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    try {
      return await this.cashflowService.change(data, id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting permission' })
  @ApiOkResponse({
    description: 'Permission was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string) {
    try {
      return await this.cashflowService.deleteOne(id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
