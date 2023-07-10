import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
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

import { UpdateClientRequestDto, CreateClientRequestDto } from './dto';
import { ClientRequest } from './client-request.entity';
import { ClientRequestService } from './client-request.service';
import { PaginationDto } from '../../infra/shared/dto';
import { Route } from '../../infra/shared/decorators/route.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from '../../infra/shared/enum';

@ApiTags('Client-Request')
@Controller('client-request')
export class ClientRequestController {
  constructor(private readonly clientRequestService: ClientRequestService) {}

  @Get('/')
  @ApiOperation({ summary: 'Method: returns all client requests' })
  @ApiOkResponse({
    description: 'The client requests were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getData(@Route() route: string, @Query() query: PaginationDto) {
    return await this.clientRequestService.getAll({ ...query, route });
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns single client request by id' })
  @ApiOkResponse({
    description: 'The client request was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getMe(@Param('id') id: string): Promise<ClientRequest> {
    return this.clientRequestService.getOne(id);
  }

  @Post('/')
  @Roles(UserRoleEnum.BOSS, UserRoleEnum.SUPPER_MANAGER, UserRoleEnum.MANAGER)
  @ApiOperation({ summary: 'Method: creates new client request' })
  @ApiCreatedResponse({
    description: 'The client request was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData(@Body() data: CreateClientRequestDto): Promise<ClientRequest> {
    return await this.clientRequestService.create(data);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Method: updating client request' })
  @ApiOkResponse({
    description: 'client request was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeData(
    @Body() data: UpdateClientRequestDto,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    return await this.clientRequestService.change(data, id);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting client request' })
  @ApiOkResponse({
    description: 'client request was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string) {
    return await this.clientRequestService.deleteOne(id);
  }
}
