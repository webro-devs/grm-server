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
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';

import { CreateShapeDto, UpdateShapeDto } from './dto';
import { Shape } from './shape.entity';
import { ShapeService } from './shape.service';
import { PaginationDto } from '../../infra/shared/dto';
import { Route } from '../../infra/shared/decorators/route.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from '../../infra/shared/enum';

@ApiTags('Shape')
@Controller('shape')
export class ShapeController {
  constructor(private readonly shapeService: ShapeService) {}

  // @Public()
  @Get('/')
  @ApiOperation({ summary: 'Method: returns all Shapes' })
  @ApiOkResponse({
    description: 'The Shapes were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getData(@Route() route: string, @Query() query: PaginationDto) {
    try {
      return await this.shapeService.getAll({ ...query, route });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // @Public()
  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns single Shape by id' })
  @ApiOkResponse({
    description: 'The Shape was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getMe(@Param('id') id: string): Promise<Shape> {
    return this.shapeService.getOne(id);
  }

  // @Roles(userRoles.ADMIN, userRoles.SUPER_ADMIN)
  @Post('/')
  @Roles(UserRoleEnum.BOSS, UserRoleEnum.SUPPER_MANAGER, UserRoleEnum.MANAGER)
  @ApiOperation({ summary: 'Method: creates new Shape' })
  @ApiCreatedResponse({
    description: 'The Shape was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData(@Body() data: CreateShapeDto): Promise<Shape> {
    try {
      return await this.shapeService.create(data);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // @Roles(userRoles.ADMIN, userRoles.SUPER_ADMIN)
  @Patch('/:id')
  @ApiOperation({ summary: 'Method: updating Shape' })
  @ApiOkResponse({
    description: 'Shape was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeData(
    @Body() data: UpdateShapeDto,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    try {
      return await this.shapeService.change(data, id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // @Roles(userRoles.ADMIN, userRoles.SUPER_ADMIN)
  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting Shape' })
  @ApiOkResponse({
    description: 'Shape was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string) {
    try {
      return await this.shapeService.deleteOne(id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
