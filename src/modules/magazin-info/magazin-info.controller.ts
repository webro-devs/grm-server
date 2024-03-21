import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { UpdateMagazinInfoDto } from './dto';
import { MagazinInfoService } from './magazin-info.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from '../../infra/shared/enum';
import { Public } from '../auth/decorators/public.decorator';
import { Put } from '@nestjs/common/decorators';

@ApiTags('Magazine')
@Controller('magazine-info')
export class MagazinInfoController {
  constructor(private readonly magazineInfoService: MagazinInfoService) {}

  @Public()
  @Get('/')
  @ApiOperation({ summary: 'Method: returns all magazine info' })
  @ApiOkResponse({
    description: 'The magazine info were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getData() {
    return await this.magazineInfoService.getAll();
  }

  @Put('/')
  @Roles(UserRoleEnum.BOSS, UserRoleEnum.SUPPER_MANAGER)
  @ApiOperation({ summary: 'Method: updating magazine info' })
  @ApiOkResponse({
    description: 'magazine info was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeData(
    @Body() data: UpdateMagazinInfoDto,
  ): Promise<UpdateResult> {
    return await this.magazineInfoService.change(data);
  }

  @Delete('/:id')
  @Roles(UserRoleEnum.BOSS, UserRoleEnum.SUPPER_MANAGER)
  @ApiOperation({ summary: 'Method: deleting magazine info' })
  @ApiOkResponse({
    description: 'magazine info was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string) {
    return "ok";
  }
}
