import {
  Controller,
  Get,
  Post,
  Patch,
  HttpCode,
  Query,
  Body,
  Param,
  Delete,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';
import { FilialService } from './filial.service';
import { Route } from '../../infra/shared/decorators/route.decorator';
import { PaginationDto } from '../../infra/shared/dto';
import { Filial } from './filial.entity';
import { CreateFilialDto, UpdateFilialDto } from './dto';
import { UpdateResult } from 'typeorm';

@ApiTags('Filial')
@Controller('filial')
export class FilialController {
  constructor(private readonly filialService: FilialService) {}

  // @Public()
  @Get('/')
  @ApiOperation({ summary: 'Method: returns all filial' })
  @ApiOkResponse({
    description: 'The filial were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getData(@Route() route: string, @Query() query: PaginationDto) {
    try {
      return await this.filialService.getAll({ ...query, route });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // @Public()
  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns single filial by id' })
  @ApiOkResponse({
    description: 'The filial was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getMe(@Param('id') id: string): Promise<Filial> {
    return this.filialService.getOne(id);
  }

  // @Roles(userRoles.ADMIN, userRoles.SUPER_ADMIN)
  @Post('/')
  @ApiOperation({ summary: 'Method: creates new filial' })
  @ApiCreatedResponse({
    description: 'The filial was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData(@Body() data: CreateFilialDto): Promise<Filial> {
    try {
      return await this.filialService.create(data);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // @Roles(userRoles.ADMIN, userRoles.SUPER_ADMIN)
  @Patch('/:id')
  @ApiOperation({ summary: 'Method: updating filial' })
  @ApiOkResponse({
    description: 'Filial was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeData(
    @Body() data: UpdateFilialDto,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    try {
      return await this.filialService.change(data, id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // @Roles(userRoles.ADMIN, userRoles.SUPER_ADMIN)
  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting filial' })
  @ApiOkResponse({
    description: 'Filial was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string) {
    try {
      return await this.filialService.deleteOne(id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
