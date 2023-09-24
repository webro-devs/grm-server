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
import { UpdateResult } from 'typeorm';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';

import { CreatePartiyaDto, UpdatePartiyaDto } from './dto';
import { Partiya } from './partiya.entity';
import { PartiyaService } from './partiya.service';
import { PaginationDto } from '../../infra/shared/dto';
import { Route } from '../../infra/shared/decorators/route.decorator';

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
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
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
  @ApiOperation({ summary: 'Method: creates new partiya' })
  @ApiCreatedResponse({
    description: 'The partiya was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveDataExc(@Body() positionData: CreatePartiyaDto): Promise<Partiya> {
    try {
      return await this.partiyaService.createPartiyaWithExcel(positionData);
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
  async changeData(
    @Body() data: UpdatePartiyaDto,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    try {
      return await this.partiyaService.change(data, id);
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
