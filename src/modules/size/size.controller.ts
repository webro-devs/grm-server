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

import { CreateSizeDto, UpdateSizeDto } from './dto';
import { Size } from './size.entity';
import { SizeService } from './size.service';
import { PaginationDto } from '../../infra/shared/dto';
import { Route } from '../../infra/shared/decorators/route.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from 'src/infra/shared/enum';

@ApiTags('Size')
@Controller('size')
export class SizeController {
  constructor(private readonly sizeService: SizeService) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns single size by id' })
  @ApiOkResponse({
    description: 'The size was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getMe(@Param('id') id: string): Promise<Size> {
    return this.sizeService.getOne(id);
  }

  @Post('/')
  @Roles(UserRoleEnum.BOSS, UserRoleEnum.SUPPER_MANAGER, UserRoleEnum.MANAGER)
  @ApiOperation({ summary: 'Method: creates new size' })
  @ApiCreatedResponse({
    description: 'The size was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData(@Body() data: CreateSizeDto): Promise<Size> {
    return await this.sizeService.create(data);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Method: updating size' })
  @ApiOkResponse({
    description: 'Size was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeData(
    @Body() CollectionData: UpdateSizeDto,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    return await this.sizeService.change(CollectionData, id);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting size' })
  @ApiOkResponse({
    description: 'Size was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string) {
    return await this.sizeService.deleteOne(id);
  }
}
