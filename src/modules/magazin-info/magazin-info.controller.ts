import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
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

import { CreateMagazinInfoDto, UpdateMagazinInfoDto } from './dto';
import { MagazinInfo } from './magazin-info.entity';
import { MagazinInfoService } from './magazin-info.service';
import { PaginationDto } from '../../infra/shared/dto';
import { Route } from '../../infra/shared/decorators/route.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from '../../infra/shared/enum';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Magazin-info')
@Controller('magazin-info')
export class MagazinInfoController {
  constructor(private readonly magazinInfoService: MagazinInfoService) {}

  @Public()
  @Get('/')
  @ApiOperation({ summary: 'Method: returns all magazin info' })
  @ApiOkResponse({
    description: 'The magazin info were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getData(@Route() route: string, @Query() query: PaginationDto) {
    return await this.magazinInfoService.getAll({ ...query, route });
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns single magazin info by id' })
  @ApiOkResponse({
    description: 'The magazin info was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getMe(@Param('id') id: string): Promise<MagazinInfo> {
    return this.magazinInfoService.getOne(id);
  }

  @Post('/')
  @Roles(UserRoleEnum.BOSS, UserRoleEnum.SUPPER_MANAGER, UserRoleEnum.MANAGER)
  @ApiOperation({ summary: 'Method: creates new magazin info' })
  @ApiCreatedResponse({
    description: 'The magazin info was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData(@Body() data: CreateMagazinInfoDto): Promise<MagazinInfo> {
    return await this.magazinInfoService.create(data);
  }

  @Patch('/:id')
  @Roles(UserRoleEnum.BOSS, UserRoleEnum.SUPPER_MANAGER, UserRoleEnum.MANAGER)
  @ApiOperation({ summary: 'Method: updating magazin info' })
  @ApiOkResponse({
    description: 'magazin info was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeData(
    @Body() data: UpdateMagazinInfoDto,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    return await this.magazinInfoService.change(data, id);
  }

  @Delete('/:id')
  @Roles(UserRoleEnum.BOSS, UserRoleEnum.SUPPER_MANAGER, UserRoleEnum.MANAGER)
  @ApiOperation({ summary: 'Method: deleting magazin info' })
  @ApiOkResponse({
    description: 'magazin info was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string) {
    return await this.magazinInfoService.deleteOne(id);
  }
}
