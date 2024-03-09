import { Controller, Post, Body, HttpCode, HttpStatus, Delete, Patch, Param, Get, Query, Put } from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { ApiCreatedResponse, ApiOkResponse, ApiTags, ApiOperation } from '@nestjs/swagger';

import { CreateBannerDto, UpdateBannerDto } from './dto';
import { Banner } from './banner.entity';
import { BannerService } from './banner.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from 'src/infra/shared/enum';

@ApiTags('Banner')
@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Get('/')
  @ApiOperation({ summary: 'Method: returns single size by id' })
  @ApiOkResponse({
    description: 'The size was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getAll(): Promise<Banner[]> {
    return this.bannerService.getAll();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns single size by id' })
  @ApiOkResponse({
    description: 'The size was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getMe(@Param('id') id: string): Promise<Banner> {
    return this.bannerService.getOne(id);
  }

  @Post('/')
  // @Roles(UserRoleEnum.BOSS, UserRoleEnum.SUPPER_MANAGER, UserRoleEnum.MANAGER)
  @ApiOperation({ summary: 'Method: creates new size' })
  @ApiCreatedResponse({
    description: 'The size was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData(@Body() data: CreateBannerDto): Promise<Banner> {
    return await this.bannerService.create(data);
  }

  @Put('/all')
  @ApiOperation({ summary: 'Method: updating size' })
  @ApiOkResponse({
    description: 'Size was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeDataAll(@Body() BannerData: UpdateBannerDto[]): Promise<string> {
    return await this.bannerService.changeAll(BannerData);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Method: updating size' })
  @ApiOkResponse({
    description: 'Size was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeData(@Body() CollectionData: UpdateBannerDto, @Param('id') id: string): Promise<UpdateResult> {
    return await this.bannerService.change(CollectionData, id);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting size' })
  @ApiOkResponse({
    description: 'Size was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string) {
    return await this.bannerService.deleteOne(id);
  }
}
