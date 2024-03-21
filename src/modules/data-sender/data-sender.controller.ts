import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiOperation } from '@nestjs/swagger';

import { Public } from '../auth/decorators/public.decorator';
import { DataSenderService } from './data-sender.service';
import CreateSenderDataDto from './dto/create-senderData.dto';

@ApiTags('Data-sender')
@Controller('data-sender')
export class DataSenderController {
  constructor(private readonly dataSenderService: DataSenderService) {}

  @Public()
  @Post('/')
  @ApiOperation({ summary: 'Method: returns all products' })
  @ApiOkResponse({
    description: 'The products were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async OnSender(@Body() data: CreateSenderDataDto) {
    return this.dataSenderService.cronJob(data);
  }

  @Public()
  @Get('/off-sender')
  @ApiOperation({ summary: 'Method: returns all products' })
  @ApiOkResponse({
    description: 'The products were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async offSender() {
    return this.dataSenderService.onModuleDestroy();
  }
}
