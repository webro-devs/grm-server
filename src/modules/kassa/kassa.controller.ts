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
import { KassaService } from './kassa.service';
import { Kassa } from './kassa.entity';
import { Route } from '../../infra/shared/decorators/route.decorator';
import { PaginationDto, RangeDto } from '../../infra/shared/dto';
import { CreateKassaDto, UpdateKassaDto } from './dto';
import { Public } from '../auth/decorators/public.decorator';

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
    return await this.kassaService.getAll({ ...query, route });
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns single kassa by id' })
  @ApiOkResponse({
    description: 'The kassa was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getMe(@Param('id') id: string): Promise<Kassa> {
    return await this.kassaService.getOne(id);
  }

  @Get('/open-kassa/:filialId')
  @ApiOperation({ summary: 'Method: returns single kassa' })
  @ApiOkResponse({
    description: 'The kassa was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async opnKassa(@Param('filialId') id: string): Promise<Kassa | unknown> {
    return await this.kassaService.GetOpenKassa(id);
  }

  @Public()
  @Get('/calculate/all-filial/by-range')
  @ApiOperation({ summary: 'Method: returns by range kassa accounting' })
  @ApiOkResponse({
    description: 'The kassa accounting returned by range successfully',
  })
  @HttpCode(HttpStatus.OK)
  async kassaSumAllFilialByRange(@Req() req, @Query() query: RangeDto) {
    return await this.kassaService.kassaSumAllFilialByRange(req.where);
  }

  @Get('/calculate/by-range')
  @ApiOperation({ summary: 'Method: returns by range kassa accounting' })
  @ApiOkResponse({
    description: 'The kassa accounting returned by range successfully',
  })
  @HttpCode(HttpStatus.OK)
  async kassaSumByFilialAndRange(@Req() req) {
    return await this.kassaService.kassaSumByFilialAndRange(req.where);
  }

  @Get('/calculate/:id')
  @ApiOperation({ summary: 'Method: returns kassa accounting' })
  @ApiOkResponse({
    description: 'The kassa accounting returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getKassaCalculate(@Param('id') id: string) {
    return await this.kassaService.getKassaSum(id);
  }

  @Post('/')
  @ApiOperation({ summary: 'Method: creates new kassa' })
  @ApiCreatedResponse({
    description: 'The kassa was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData(@Body() data: CreateKassaDto) {
    const check = await this.kassaService.create(data);
    if (!check) {
      throw new HttpException(
        'First you Should close kassa',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      return check;
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
    return await this.kassaService.change(positionData, id);
  }

  @Patch('/close-kassa/:id')
  @ApiOperation({ summary: 'Method: closing kassa' })
  @ApiOkResponse({
    description: 'Kassa was closed',
  })
  @HttpCode(HttpStatus.OK)
  async closeKassa(@Param('id') id: string): Promise<UpdateResult> {
    return await this.kassaService.closeKassa(id);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting kassa' })
  @ApiOkResponse({
    description: 'Kassa was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string) {
    return await this.kassaService.deleteOne(id);
  }
}
