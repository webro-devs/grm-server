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
import { KassaService } from './kassa.service';
import { Kassa } from './kassa.entity';
import { Route } from '../../infra/shared/decorators/route.decorator';
import { PaginationDto } from '../../infra/shared/dto';
import { CreateKassaDto, UpdateKassaDto } from './dto';

@ApiTags('Kassa')
@Controller('kassa')
export class KassaController {
  constructor(private readonly kassaService: KassaService) {}

  @Get('/')
  @ApiOperation({ summary: 'Method: returns all kassa' })
  @ApiOkResponse({
    description: 'The kassa were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getData(@Route() route: string, @Query() query: PaginationDto) {
    try {
      return await this.kassaService.getAll({ ...query, route });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns single kassa by id' })
  @ApiOkResponse({
    description: 'The kassa was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getMe(@Param('id') id: string): Promise<Kassa> {
    return this.kassaService.getOne(id);
  }

  @Get('/calculate/:id')
  @ApiOperation({ summary: 'Method: returns kassa accounting' })
  @ApiOkResponse({
    description: 'The kassa accounting returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getKassaCalculate(@Param('id') id: string) {
    return this.kassaService.calculateKassa(id);
  }

  @Post('/')
  @ApiOperation({ summary: 'Method: creates new kassa' })
  @ApiCreatedResponse({
    description: 'The kassa was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData(@Body() data: CreateKassaDto) {
    try {
      return await this.kassaService.create(data);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Method: updating kassa' })
  @ApiOkResponse({
    description: 'Kassa was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeData(
    @Body() positionData: UpdateKassaDto,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    try {
      return await this.kassaService.change(positionData, id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting kassa' })
  @ApiOkResponse({
    description: 'Kassa was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string) {
    try {
      return await this.kassaService.deleteOne(id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
