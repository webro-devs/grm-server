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
  Res,
  StreamableFile,
} from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { ApiCreatedResponse, ApiOkResponse, ApiTags, ApiOperation } from '@nestjs/swagger';

import { CreateClientDto, CreateUserDto, UpdateClientDto, UpdateUserDto } from './dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { PaginationDto } from '../../infra/shared/dto';
import { Route } from '../../infra/shared/decorators/route.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from 'src/infra/shared/enum';
import * as path from 'path';
import { createReadStream, existsSync } from 'fs';
import * as AdmZip from 'adm-zip';

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

  @Get('/info/me')
  @ApiOperation({ summary: 'Method: returns single user by id' })
  @ApiOkResponse({
    description: 'The user was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getme(@Req() request): Promise<User> {
    return await this.userService.getOne(request.user.id);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns single user by id' })
  @ApiOkResponse({
    description: 'The user was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getMe(@Param('id') id: string, @Query() query, @Req() req): Promise<User> {
    query['collection'] = !query?.collection && req?.['user'].role == 1 ? true : query?.collection || null;
    console.log(query);

    return await this.userService.getOne(id, query?.from || null, query.to || null, query.collection);
  }

  @Get('/client/:id')
  @ApiOperation({ summary: 'Method: returns single client by id' })
  @ApiOkResponse({
    description: 'The client was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getClientById(@Param('id') id: string): Promise<User> {
    return this.userService.getClientById(id);
  }

  @Get('/filial/:filialId')
  @ApiOperation({ summary: 'Method: returns users with their selling result' })
  @ApiOkResponse({
    description: 'The users selling result was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getUserSelling(@Param('filialId') id: string): Promise<User[]> {
    return this.userService.getUsersWithSellingWithOrder(id);
  }

  @Public()
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
  async createClient(@Body() data: CreateClientDto) {
    return await this.userService.createClient(data);
  }

  @Post('/add-favorite-product/:productId')
  @ApiOperation({ summary: 'Method: add favorite product' })
  @ApiCreatedResponse({
    description: 'The client was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async addFavoriteProduct(@Param('productId') productId: string, @Req() req) {
    return await this.userService.addFavoriteProduct(req.user.id, productId);
  }

  @Post('/remove-favorite-product/:productId')
  @ApiOperation({ summary: 'Method: remove favorite product' })
  @ApiCreatedResponse({
    description: 'The client was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async removeFavoriteProduct(@Param('productId') productId: string, @Req() req) {
    return await this.userService.removeFavoriteProduct(req.user.id, productId);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Method: updating user' })
  @ApiOkResponse({
    description: 'User was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeData(@Body() positionData: UpdateUserDto, @Param('id') id: string): Promise<UpdateResult> {
    return await this.userService.change(positionData, id);
  }

  @Patch('/client/:id')
  @ApiOperation({ summary: 'Method: updating client' })
  @ApiOkResponse({
    description: 'Client was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeClient(@Body() data: UpdateClientDto, @Param('id') id: string): Promise<UpdateResult> {
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

  @Roles(UserRoleEnum.BOSS)
  @Get('/backup/basa')
  @ApiOperation({ summary: 'Method: deleting user' })
  @ApiOkResponse({
    description: 'created baza!',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async backup(@Res() res) {
    try {
      const pathfile = path.join(process.cwd(), 'backup');
      if (existsSync(pathfile)) {
        const zip = new AdmZip();
        await zip.addLocalFolder(pathfile);
        const response = await zip.toBuffer();
        const fileName = 'backup.zip';
        const fileType = 'application/zip';

        res.writeHead(200, {
          'Content-Disposition': `attachment; filename="${fileName}`,
          'Content-Type': fileType,
        });

        return res.end(response);
      } else return { data: null, isNaN: true };
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error');
    }
  }

  @Roles(UserRoleEnum.BOSS)
  @Get('/backup/basaa')
  @ApiOperation({ summary: 'Method: deleting user' })
  @ApiOkResponse({
    description: 'Database returning!',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async createBackup() {
    await this.userService.createBackup();

    return 'success';
  }
}
