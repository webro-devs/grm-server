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

import { CreateActionDto, UpdateActionDto } from './dto';
import { Action } from './action.entity';
import { ActionService } from './action.service';
import { PaginationDto } from '../../infra/shared/dto';
import { Route } from '../../infra/shared/decorators/route.decorator';

@ApiTags('Action')
@Controller('action')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @Get('/')
  @ApiOperation({ summary: 'Method: returns all actions' })
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

  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns single action by id' })
  @ApiOkResponse({
    description: 'The action was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getMe(@Param('id') id: string): Promise<Action> {
    return this.actionService.getOne(id);
  }

  @Post('/')
  @ApiOperation({ summary: 'Method: creates new action' })
  @ApiCreatedResponse({
    description: 'The action was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData(@Body() data: CreateActionDto): Promise<Action> {
    try {
      return await this.actionService.create(data);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Method: updating action' })
  @ApiOkResponse({
    description: 'Action was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeData(
    @Body() CollectionData: UpdateActionDto,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    try {
      return await this.actionService.change(CollectionData, id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting action' })
  @ApiOkResponse({
    description: 'Action was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string) {
    try {
      return await this.actionService.deleteOne(id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
