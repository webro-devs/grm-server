import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { InsertResult, UpdateResult } from 'typeorm';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateQrBaseDto, UpdateQrBaseDto } from './dto';
import { QrBase } from './qr-base.entity';
import { QrBaseService } from './qr-base.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from '../../infra/shared/enum';
import { Put } from '@nestjs/common/decorators';

@ApiTags('QrBase')
@Controller('qr-base')
export class QrBaseController {
  constructor(private readonly qrBaseService: QrBaseService) {}

  @Get('/')
  @Roles(UserRoleEnum.BOSS, UserRoleEnum.SUPPER_MANAGER, UserRoleEnum.MANAGER)
  @ApiOperation({ summary: 'Method: returns all Qr-Base by id' })
  @ApiOkResponse({
    description: 'The Qr-Bases was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getAll(): Promise<QrBase[]> {
    return this.qrBaseService.getAll();
  }

  @Get('/:id')
  @Roles(UserRoleEnum.BOSS, UserRoleEnum.SUPPER_MANAGER, UserRoleEnum.MANAGER)
  @ApiOperation({ summary: 'Method: returns single Qr-Base by id' })
  @ApiOkResponse({
    description: 'The Qr-Base was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getOne(@Param('id') id: string): Promise<QrBase> {
    return this.qrBaseService.getOne(id);
  }


  @Post('/')
  @Roles(UserRoleEnum.BOSS, UserRoleEnum.SUPPER_MANAGER, UserRoleEnum.MANAGER)
  @ApiOperation({ summary: 'Method: creates new Qr-Base' })
  @ApiCreatedResponse({
    description: 'The Qr-Base was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData(@Body() data: CreateQrBaseDto): Promise<InsertResult> {
    return await this.qrBaseService.create(data);
  }

  @Put('/:id')
  @Roles(UserRoleEnum.BOSS, UserRoleEnum.SUPPER_MANAGER, UserRoleEnum.MANAGER)
  @ApiOperation({ summary: 'Method: updating Qr-Base' })
  @ApiOkResponse({
    description: 'Qr-Base was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeData(
    @Body() data: UpdateQrBaseDto,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    return await this.qrBaseService.change(data, id);
  }

  @Delete('/:id')
  @Roles(UserRoleEnum.BOSS, UserRoleEnum.SUPPER_MANAGER, UserRoleEnum.MANAGER)
  @ApiOperation({ summary: 'Method: deleting Qr-Base' })
  @ApiOkResponse({
    description: 'Qr-Base was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string) {
    return await this.qrBaseService.deleteOne(id);
  }
}
