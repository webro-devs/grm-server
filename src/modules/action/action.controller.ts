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
import { InsertResult, UpdateResult } from 'typeorm';
import { ApiCreatedResponse, ApiOkResponse, ApiTags, ApiOperation } from '@nestjs/swagger';

import { CreateActionDto } from './dto';
import { Action } from './action.entity';
import { ActionService } from './action.service';
import { PaginationDto, ProductQueryDto } from '../../infra/shared/dto';
import { Route } from '../../infra/shared/decorators/route.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from 'src/infra/shared/enum';

@ApiTags('Action')
@Controller('action')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @Get('/')
  @Roles(UserRoleEnum.BOSS)
  @ApiOperation({ summary: 'Method: returns single color by id' })
  @ApiOkResponse({
    description: 'The action was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getAll(@Query() query: ProductQueryDto) {
    return await this.actionService.getAll({ limit: query.limit, page: query.page });
  }

  @Post('/')
  @ApiOperation({ summary: 'Method: creates new color' })
  @ApiCreatedResponse({
    description: 'The color was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData(@Body() data: CreateActionDto, @Req() req): Promise<InsertResult> {
    return await this.actionService.create(
      { info: 'ashdjashdkj' },
      req.user.id,
      'e5a5e4b8-b1d2-419a-b283-d19da945a6e3',
      'transfer',
    );
  }
}
