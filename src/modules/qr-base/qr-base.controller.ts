import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { InsertResult, UpdateResult } from 'typeorm';
import { ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateQrBaseDto, UpdateQrBaseDto, ImportQrBaseDto } from './dto';
import { QrBase } from './qr-base.entity';
import { QrBaseService } from './qr-base.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from '../../infra/shared/enum';
import { Put, UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import QrBaseQueryDto from '../../infra/shared/dto/qr-base.query.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '../auth/decorators/public.decorator';
import { multerStorage } from 'src/infra/helpers';

@ApiTags('QrBase')
@Controller('qr-base')
export class QrBaseController {
  constructor(private readonly qrBaseService: QrBaseService) {}

  @Get('/')
  @Roles(UserRoleEnum.BOSS, UserRoleEnum.SUPPER_MANAGER, UserRoleEnum.MANAGER)
  @ApiOperation({ summary: 'Method: returns all Qr-Base by id' })
  @ApiOkResponse({
    description: 'The Qr-Bases was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getAll(@Query() query?: QrBaseQueryDto): Promise<Pagination<QrBase>> {
    return await this.qrBaseService.getAll({
      limit: query.limit,
      page: query.page,
    }, query);
  }

  @Get('/:id')
  @Roles(UserRoleEnum.BOSS, UserRoleEnum.SUPPER_MANAGER, UserRoleEnum.MANAGER)
  @ApiOperation({ summary: 'Method: returns single Qr-Base by id' })
  @ApiOkResponse({
    description: 'The Qr-Base was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getOne(@Param('id') id: string): Promise<QrBase> {
    return this.qrBaseService.getOne(id);
  }

  @Post('/')
  @Roles(UserRoleEnum.BOSS, UserRoleEnum.SUPPER_MANAGER, UserRoleEnum.MANAGER)
  @ApiOperation({ summary: 'Method: creates new Qr-Base' })
  @ApiCreatedResponse({
    description: 'The Qr-Base was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData(@Body() data: CreateQrBaseDto): Promise<QrBase> {
    const res = await this.qrBaseService.create(data);
    return await this.qrBaseService.getOne(res.raw[0].id);
  }

  @Put('/:id')
  @Roles(UserRoleEnum.BOSS, UserRoleEnum.SUPPER_MANAGER, UserRoleEnum.MANAGER)
  @ApiOperation({ summary: 'Method: updating Qr-Base' })
  @ApiOkResponse({
    description: 'Qr-Base was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeData(@Body() data: UpdateQrBaseDto, @Param('id') id: string): Promise<UpdateResult> {
    return await this.qrBaseService.change(data, id);
  }

  @Delete('/:id')
  @Roles(UserRoleEnum.BOSS, UserRoleEnum.SUPPER_MANAGER, UserRoleEnum.MANAGER)
  @ApiOperation({ summary: 'Method: deleting Qr-Base' })
  @ApiOkResponse({
    description: 'Qr-Base was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string) {
    return await this.qrBaseService.deleteOne(id);
  }

  @Public()
  @Post('/support')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Method: imports excel file and returns json data' })
  @ApiCreatedResponse({
    description: 'The excel file imported and converted to json successfully',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multerStorage('uploads/support'),
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  async createExcel(@UploadedFile() file: Express.Multer.File, @Body() bodyData: ImportQrBaseDto) {
    const data: CreateQrBaseDto[] = this.qrBaseService.readExcel(file.path);

    return await this.qrBaseService.findOrCreate(data);
  }
}
