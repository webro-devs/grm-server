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
import { GRMGateway } from './web-socket.gateway';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Socket')
@Controller('socket')
export class SocketController {
  constructor(private readonly socketGateWay: GRMGateway) {}

  @Public()
  @Get('/ha')
  @ApiOperation({ summary: 'Method: logs ha' })
  @ApiCreatedResponse({
    description: 'The ha logged',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData() {
    try {
      return 'data';
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
