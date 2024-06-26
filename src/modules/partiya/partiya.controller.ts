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
  BadRequestException,
  Req,
  Put,
} from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { ApiCreatedResponse, ApiOkResponse, ApiTags, ApiOperation } from '@nestjs/swagger';

import { CreatePartiyaDto, UpdatePartiyaDto } from './dto';
import { Partiya } from './partiya.entity';
import { PartiyaService } from './partiya.service';
import { PaginationDto } from '../../infra/shared/dto';
import { Route } from '../../infra/shared/decorators/route.decorator';
import { ActionService } from '../action/action.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from 'src/infra/shared/enum';

@ApiTags('Partiya')
@Controller('partiya')
export class PartiyaController {
  constructor(private readonly partiyaService: PartiyaService) {}

  @Get('/')
  @ApiOperation({ summary: 'Method: returns all partiya' })
  @ApiOkResponse({
    description: 'The partiya were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getData(@Route() route: string, @Query() query: PaginationDto) {
    try {
      return await this.partiyaService.getAll({ ...query, route });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Get('/date-range')
  @ApiOperation({ summary: 'Method: returns all partiya by date range' })
  @ApiOkResponse({
    description: 'The partiya were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getDataByRange() {
    try {
      return await this.partiyaService.getAllByDateRange();
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns single partiya by id' })
  @ApiOkResponse({
    description: 'The partiya was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getMe(@Param('id') id: string) {
    return this.partiyaService.getOne(id);
  }

  @Post('/')
  @Roles(UserRoleEnum.BOSS, UserRoleEnum.MANAGER)
  @ApiOperation({ summary: 'Method: creates new partiya' })
  @ApiCreatedResponse({
    description: 'The partiya was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveDataExc(@Body() positionData: CreatePartiyaDto, @Req() req): Promise<Partiya> {
    try {
      return await this.partiyaService.create(positionData, req.user);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Method: updating partiya' })
  @ApiOkResponse({
    description: 'Partiya was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeData(@Body() data: UpdatePartiyaDto, @Param('id') id: string, @Req() req): Promise<UpdateResult> {
    try {
      return await this.partiyaService.change(data, id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('/expense/:id')
  @ApiOperation({ summary: 'Method: updating partiya' })
  @ApiOkResponse({
    description: 'Partiya was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeexpense(@Body() data: UpdatePartiyaDto, @Param('id') id: string, @Req() req): Promise<UpdateResult> {
    try {
      return await this.partiyaService.changeExp(data.expense, id, req.user);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting partiya' })
  @ApiOkResponse({
    description: 'Partiya was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string) {
    try {
      return await this.partiyaService.deleteOne(id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
