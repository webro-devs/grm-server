import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilialService } from './filial.service';
import { Route } from '../../infra/shared/decorators/route.decorator';
import { PaginationDto } from '../../infra/shared/dto';
import { Filial } from './filial.entity';
import { CreateFilialDto, UpdateFilialDto } from './dto';
import { UpdateResult } from 'typeorm';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Filial')
@Controller('filial')
export class FilialController {
  constructor(private readonly filialService: FilialService) {}

  @Get('/')
  @ApiOperation({ summary: 'Method: returns all filial' })
  @ApiOkResponse({
    description: 'The filial were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getData(@Route() route: string, @Query() query: PaginationDto, @Req() req) {
    const filials = await this.filialService.getAll({ ...query, route });
    if(req?.user?.role === 5){
      return { items: filials.items.filter(e => e.title != 'baza') };
    }else if(req?.user?.role === 3){
      return { items: filials.items.filter(e => e.title != 'baza' && e.title != 'I-Dokon') };
    }
    return filials;
  }

  @Get('/action')
  @ApiOperation({ summary: 'Method: returns all filial' })
  @ApiOkResponse({
    description: 'The filial were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getAction() {
    return await this.filialService.name();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns single filial by id' })
  @ApiOkResponse({
    description: 'The filial was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getMe(@Param('id') id: string): Promise<Filial> {
    return this.filialService.getOne(id);
  }

  @Public()
  @Post('/')
  @ApiOperation({ summary: 'Method: creates new filial' })
  @ApiCreatedResponse({
    description: 'The filial was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData(@Body() data: CreateFilialDto): Promise<Filial> {
    return await this.filialService.create(data);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Method: updating filial' })
  @ApiOkResponse({
    description: 'Filial was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeData(@Body() data: UpdateFilialDto, @Param('id') id: string): Promise<UpdateResult> {
    return await this.filialService.change(data, id);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting filial' })
  @ApiOkResponse({
    description: 'Filial was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string) {
    return await this.filialService.deleteOne(id);
  }
}
