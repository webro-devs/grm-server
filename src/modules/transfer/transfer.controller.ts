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
import { TransferService } from './transfer.service';
import { Route } from '../../infra/shared/decorators/route.decorator';
import { PaginationDto } from '../../infra/shared/dto';
import { CreateTransferDto, UpdateTransferDto } from './dto';
import { Transfer } from './transfer.entity';

@ApiTags('Transfer')
@Controller('transfer')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Get('/')
  @ApiOperation({ summary: 'Method: returns all transfers' })
  @ApiOkResponse({
    description: 'The transfers were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getData(@Route() route: string, @Query() query: PaginationDto) {
    return await this.transferService.getAll({ ...query, route });
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns single transfer by id' })
  @ApiOkResponse({
    description: 'The transfer was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getMe(@Param('id') id: string): Promise<Transfer> {
    return this.transferService.getById(id);
  }

  @Post('/')
  @ApiOperation({ summary: 'Method: creates new transfer' })
  @ApiCreatedResponse({
    description: 'The transfer was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData(@Body() data: CreateTransferDto[], @Req() request) {
    return await this.transferService.create(data, request.user.id);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Method: updating transfer' })
  @ApiOkResponse({
    description: 'Transfer was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeData(
    @Body() data: UpdateTransferDto,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    return await this.transferService.change(data, id);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting transfer' })
  @ApiOkResponse({
    description: 'Transfer was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string) {
    return await this.transferService.deleteOne(id);
  }
}
