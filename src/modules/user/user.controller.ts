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

import { CreateUserDto, UpdateClientDto, UpdateUserDto } from './dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { PaginationDto } from '../../infra/shared/dto';
import { Route } from '../../infra/shared/decorators/route.decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @ApiOperation({ summary: 'Method: returns all users' })
  @ApiOkResponse({
    description: 'The users were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getData(@Route() route: string, @Query() query: PaginationDto) {
    return await this.userService.getAll({ ...query, route });
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns single user by id' })
  @ApiOkResponse({
    description: 'The user was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getMe(@Param('id') id: string): Promise<User> {
    return this.userService.getOne(id);
  }

  @Get('/filial/:filialId')
  @ApiOperation({ summary: 'Method: returns users with their selling result' })
  @ApiOkResponse({
    description: 'The users selling result was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getUserSelling(@Param('filialId') id: string): Promise<User[]> {
    return this.userService.getUsersWithSelling(id);
  }

  @Post('/')
  @ApiOperation({ summary: 'Method: creates new user' })
  @ApiCreatedResponse({
    description: 'The user was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData(@Body() data: CreateUserDto) {
    return await this.userService.create(data);
  }

  @Public()
  @Post('/client')
  @ApiOperation({ summary: 'Method: creates new client' })
  @ApiCreatedResponse({
    description: 'The client was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async createClient(@Body() data: { login: string; password: string }) {
    return await this.userService.createClient(data);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Method: updating user' })
  @ApiOkResponse({
    description: 'User was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeData(
    @Body() positionData: UpdateUserDto,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    return await this.userService.change(positionData, id);
  }

  @Patch('/client/:id')
  @ApiOperation({ summary: 'Method: updating client' })
  @ApiOkResponse({
    description: 'Client was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeClient(
    @Body() data: UpdateClientDto,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    return await this.userService.updateClient(id, data);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting user' })
  @ApiOkResponse({
    description: 'User was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string) {
    return await this.userService.deleteOne(id);
  }
}
