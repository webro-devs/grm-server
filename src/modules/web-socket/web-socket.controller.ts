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
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';
import { GRMGateway } from './web-socket.gateway';

@ApiTags('Socket')
@Controller('socket')
export class SocketController {
  constructor(private readonly socketGateWay: GRMGateway) {}

  @Get('/ha')
  @ApiOperation({ summary: 'Method: logs ha' })
  @ApiCreatedResponse({
    description: 'The ha logged',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData(@UploadedFile() file: Express.Multer.File) {
    try {
      return 'data';
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
