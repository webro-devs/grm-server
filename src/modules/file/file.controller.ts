import {
  Controller,
  HttpCode,
  HttpStatus,
  HttpException,
  Get,
  Query,
  Post,
  Param,
  Delete,
  Body,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { FileService } from './file.service';
import { Route } from 'src/infra/shared/decorators/route.decorator';
import { PaginationDto } from 'src/infra/shared/dto';
import { CreateFileDto, UpdateFileDto } from './dto';
import { File } from './file.entity';
import { UpdateResult } from 'typeorm';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('File')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('/')
  @ApiOperation({ summary: 'Method: returns all File' })
  @ApiOkResponse({
    description: 'The File were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getData(@Route() route: string, @Query() query: PaginationDto) {
    try {
      return await this.fileService.getAll({ ...query, route });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Public()
  @Get('/by-model')
  @ApiOperation({ summary: 'Method: returns all model' })
  @ApiOkResponse({
    description: 'The File were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async get(@Query('model') model: string) {
    return await this.fileService.getByModel(model);
  }

  @Public()
  @Post('/')
  @ApiOperation({ summary: 'Method: create file' })
  @ApiOkResponse({
    description: 'The File were create successfully',
  })
  @HttpCode(HttpStatus.OK)
  async create(@Body() data: CreateFileDto): Promise<File> {
    return await this.fileService.create(data);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Method: update file' })
  @ApiOkResponse({
    description: 'The File were update successfully',
  })
  @HttpCode(HttpStatus.OK)
  async update(
    @Body() data: UpdateFileDto,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    return await this.fileService.update(data, id);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Method: delete file' })
  @ApiOkResponse({
    description: 'The File were deleted successfully',
  })
  @HttpCode(HttpStatus.OK)
  async name(@Param('id') id: string) {
    return await this.fileService.delete(id);
  }
}
