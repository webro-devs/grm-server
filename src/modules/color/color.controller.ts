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

import { CreateColorDto, UpdateColorDto } from './dto';
import { Color } from './color.entity';
import { ColorService } from './color.service';
import { PaginationDto } from '../../infra/shared/dto';
import { Route } from '../../infra/shared/decorators/route.decorator';

@ApiTags('Color')
@Controller('color')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns single color by id' })
  @ApiOkResponse({
    description: 'The color was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getMe(@Param('id') id: string): Promise<Color> {
    return this.colorService.getOne(id);
  }

  @Post('/')
  @ApiOperation({ summary: 'Method: creates new color' })
  @ApiCreatedResponse({
    description: 'The color was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData(@Body() data: CreateColorDto): Promise<Color> {
    return await this.colorService.create(data);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Method: updating color' })
  @ApiOkResponse({
    description: 'Color was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeData(
    @Body() CollectionData: UpdateColorDto,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    return await this.colorService.change(CollectionData, id);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting color' })
  @ApiOkResponse({
    description: 'Color was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string) {
    return await this.colorService.deleteOne(id);
  }
}
