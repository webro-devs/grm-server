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

import { CreatePlatteDto, UpdatePlatteDto } from './dto';
import { Palette } from './platte.entity';
import { PlatteService } from './platte.service';
import { PaginationDto } from '../../infra/shared/dto';
import { Route } from '../../infra/shared/decorators/route.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from 'src/infra/shared/enum';

@ApiTags('Palette')
@Controller('palette')
export class PlatteController {
  constructor(private readonly platteService: PlatteService) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns single platte by id' })
  @ApiOkResponse({
    description: 'The platte was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getMe(@Param('id') id: string): Promise<Palette> {
    return this.platteService.getOne(id);
  }

  @Post('/')
  @Roles(UserRoleEnum.BOSS, UserRoleEnum.SUPPER_MANAGER, UserRoleEnum.MANAGER)
  @ApiOperation({ summary: 'Method: creates new platte' })
  @ApiCreatedResponse({
    description: 'The platte was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData(@Body() data: CreatePlatteDto): Promise<Palette> {
    return await this.platteService.create(data);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Method: updating platte' })
  @ApiOkResponse({
    description: 'Platte was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeData(
    @Body() CollectionData: UpdatePlatteDto,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    return await this.platteService.change(CollectionData, id);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting platte' })
  @ApiOkResponse({
    description: 'Platte was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string) {
    return await this.platteService.deleteOne(id);
  }
}
