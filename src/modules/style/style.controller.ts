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

import { CreateStyleDto, UpdateStyleDto } from './dto';
import { Style } from './style.entity';
import { StyleService } from './style.service';
import { PaginationDto } from '../../infra/shared/dto';
import { Route } from '../../infra/shared/decorators/route.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from '../../infra/shared/enum';

@ApiTags('Style')
@Controller('style')
export class StyleController {
  constructor(private readonly styleService: StyleService) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns single style by id' })
  @ApiOkResponse({
    description: 'The style was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getMe(@Param('id') id: string): Promise<Style> {
    return this.styleService.getOne(id);
  }

  @Post('/')
  @Roles(UserRoleEnum.BOSS, UserRoleEnum.SUPPER_MANAGER, UserRoleEnum.MANAGER)
  @ApiOperation({ summary: 'Method: creates new style' })
  @ApiCreatedResponse({
    description: 'The style was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData(@Body() data: CreateStyleDto): Promise<Style> {
    const response = await this.styleService.create(data);
    if(!(response instanceof Style) && response?.error){
      // @ts-ignore
      throw new DuplicateFilter(response.message);
    }else {
      // @ts-ignore
      return response;
    }
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Method: updating style' })
  @ApiOkResponse({
    description: 'Style was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeData(
    @Body() data: UpdateStyleDto,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    return await this.styleService.change(data, id);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting style' })
  @ApiOkResponse({
    description: 'Style was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string) {
    return await this.styleService.deleteOne(id);
  }
}
