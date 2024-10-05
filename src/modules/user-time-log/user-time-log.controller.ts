import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { LessThanOrEqual, MoreThanOrEqual, UpdateResult } from 'typeorm';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from '../../infra/shared/enum';
import { UserTimeLogService } from './user-time-log.service';
import { UserTimeLog } from './user-time-log.entity';
import { Public } from '../auth/decorators/public.decorator';
import CreateTimeLogDto from './dto/create-time-log.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@ApiTags('User Time Logs')
@Controller('user-time-log')
export class UserTimeLogController {
  constructor(private readonly userTimeLogService: UserTimeLogService) {
  }

  @Roles(UserRoleEnum.BOSS, UserRoleEnum.MANAGER)
  @Get('/')
  @ApiOperation({ summary: 'Method: returns single style by id' })
  @ApiOkResponse({
    description: 'The style was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getTimeLogs(@Query() query: any): Promise<UserTimeLog[]> {
    let where = {
      user: {
        ...(query.user && { id: query.user }),
        ...(query.filial && { filial: { id: query.filial } }),
      },
      ...(query.enter && { enter: MoreThanOrEqual(query.enter) }),
      ...(query.leave && { enter: LessThanOrEqual(query.leave) }),
    };
    return this.userTimeLogService.getAll(where);
  }

  @Public()
  @Post('/:login/:password')
  @ApiOperation({ summary: 'Method: creates new Time Log' })
  @ApiCreatedResponse({
    description: 'The Time Log was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData(
    @Body() data: CreateTimeLogDto,
    @Param('login') login: string,
    @Param('password') password: string,
  ): Promise<object> {
    await this.userTimeLogService.checkBoss({ login: '#' + login, password: '#' + password });
    await this.userTimeLogService.create(data);
    return { msg: 'ok' };
  }

  @Roles(UserRoleEnum.BOSS)
  @Patch('/:id')
  @ApiOperation({ summary: 'Method: updating style' })
  @ApiOkResponse({
    description: 'Style was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeData(
    @Body() data,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    return await this.userTimeLogService.change(data, id);
  }

  @Roles(UserRoleEnum.BOSS)
  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting style' })
  @ApiOkResponse({
    description: 'Style was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string) {
    return await this.userTimeLogService.deleteOne(id);
  }

  @Public()
  @Post('/')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(AnyFilesInterceptor())
  async createTimeLog(
    @UploadedFiles() files: Array<Express.Multer.File>, @Body() body: { event_log: string },
  ) {
    return await this.userTimeLogService.createLog(body);
  }
}
