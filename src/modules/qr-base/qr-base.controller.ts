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

import { CreateQrBaseDto, UpdateQrBaseDto } from './dto';
import { QrBase } from './qr-base.entity';
import { QrBaseService } from './qr-base.service';
import { PaginationDto } from '../../infra/shared/dto';
import { Route } from '../../infra/shared/decorators/route.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from '../../infra/shared/enum';

@ApiTags('QrBase')
@Controller('qr-base')
export class QrBaseController {
  constructor(private readonly qrBaseService: QrBaseService) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns single QrBase by id' })
  @ApiOkResponse({
    description: 'The QrBase was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getMe(@Param('id') id: string): Promise<QrBase> {
    return this.qrBaseService.getOne(id);
  }

  @Post('/')
  @Roles(UserRoleEnum.BOSS, UserRoleEnum.SUPPER_MANAGER, UserRoleEnum.MANAGER)
  @ApiOperation({ summary: 'Method: creates new QrBase' })
  @ApiCreatedResponse({
    description: 'The QrBase was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData(@Body() data: CreateQrBaseDto): Promise<QrBase> {
    return await this.qrBaseService.create(data);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Method: updating QrBase' })
  @ApiOkResponse({
    description: 'QrBase was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeData(
    @Body() data: UpdateQrBaseDto,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    return await this.qrBaseService.change(data, id);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting QrBase' })
  @ApiOkResponse({
    description: 'QrBase was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string) {
    return await this.qrBaseService.deleteOne(id);
  }
}
