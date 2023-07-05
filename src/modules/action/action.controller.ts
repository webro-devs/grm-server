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

import { CreateActionDto } from './dto';
import { Action } from './action.entity';
import { ActionService } from './action.service';
import { PaginationDto } from '../../infra/shared/dto';
import { Route } from '../../infra/shared/decorators/route.decorator';

@ApiTags('Action')
@Controller('action')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @Get('/')
  @ApiOperation({ summary: 'Method: returns all Actions' })
  @ApiOkResponse({
    description: 'The actions were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getData(@Route() route: string, @Query() query: PaginationDto) {
    try {
      return await this.actionService.getAll({ ...query, route });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/')
  @ApiOperation({ summary: 'Method: creates new Action' })
  @ApiCreatedResponse({
    description: 'The action was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData(@Body() data: CreateActionDto, @Req() request) {
    try {
      return await this.actionService.create(data, request.user.id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
