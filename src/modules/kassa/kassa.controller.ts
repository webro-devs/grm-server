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
  BadRequestException,
} from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { ApiCreatedResponse, ApiOkResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { KassaService } from './kassa.service';
import { Kassa } from './kassa.entity';
import { Route } from '../../infra/shared/decorators/route.decorator';
import { PaginationDto, RangeDto } from '../../infra/shared/dto';
import { CreateKassaDto, UpdateKassaDto } from './dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from 'src/infra/shared/enum';

@ApiTags('Kassa')
@Controller('kassa')
export class KassaController {
  constructor(private readonly kassaService: KassaService) {}

  @Get('/')
  @ApiOperation({ summary: 'Method: returns all kassa' })
  @ApiOkResponse({
    description: 'The kassa were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getData(@Route() route: string, @Query() query: PaginationDto, @Req() req) {
    return await this.kassaService.getAll({ ...query, route }, req.where);
  }

  @Roles(UserRoleEnum.CASHIER)
  @Get('/report')
  @ApiOperation({ summary: 'Method: returns single kassa' })
  @ApiOkResponse({
    description: 'The kassa was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async alKassa(@Req() req, @Query() query): Promise<Kassa | unknown> {
    return await this.kassaService.getReport({ limit: query.limit || 50, page: query.page || 1 }, req.user, {
      startDate: query.startDate,
      endDate: query?.endDate,
    });
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns single kassa by id' })
  @ApiOkResponse({
    description: 'The kassa was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getMe(@Param('id') id: string): Promise<Kassa> {
    return await this.kassaService.getOne(id);
  }

  @Roles(UserRoleEnum.CASHIER, UserRoleEnum.BOSS)
  @Get('/open-kassa/:filialId')
  @ApiOperation({ summary: 'Method: returns single kassa' })
  @ApiOkResponse({
    description: 'The kassa was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async opnKassa(@Param('filialId') id: string, @Req() req): Promise<Kassa | unknown> {
    const user = req.user;

    // if (!user?.filial?.id) {
    //  throw new BadRequestException("You don't have filial!");
    // }

    // if (user.filial.id !== id && user.role !== UserRoleEnum.BOSS) {
    // throw new BadRequestException("It's not your filial!");
    // }

    // if (user.role == UserRoleEnum.BOSS) {
    // const filial = req?.body?.filial;
    // if (filial) {
    // id = req.body.filial.id;
    // } else {
    // throw new BadRequestException("Mr Boss, You don't give filial for find kassa!");
    // }
    // }

    let kassa = await this.kassaService.GetOpenKassa(id);

    if (!kassa || !kassa?.id) {
      await this.kassaService.create({ filial: id });

      kassa = await this.kassaService.GetOpenKassa(id);
    }

    kassa['income'] = kassa?.totalSum || 0;
    kassa['expense'] = Number(kassa.expenditureBoss) + Number(kassa.expenditureShop);
    return kassa;
  }

  @Public()
  @Get('/calculate/all-filial/by-range')
  @ApiOperation({ summary: 'Method: returns by range kassa accounting' })
  @ApiOkResponse({
    description: 'The kassa accounting returned by range successfully',
  })
  @HttpCode(HttpStatus.OK)
  async kassaSumAllFilialByRange(@Req() req, @Query() query: RangeDto) {
    return await this.kassaService.kassaSumAllFilialByRange(req.where);
  }

  @Get('/calculate/by-range')
  @ApiOperation({ summary: 'Method: returns by range kassa accounting' })
  @ApiOkResponse({
    description: 'The kassa accounting returned by range successfully',
  })
  @HttpCode(HttpStatus.OK)
  async kassaSumByFilialAndRange(@Req() req) {
    return await this.kassaService.kassaSumByFilialAndRange(req.where);
  }

  @Get('/calculate/:id')
  @ApiOperation({ summary: 'Method: returns kassa accounting' })
  @ApiOkResponse({
    description: 'The kassa accounting returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getKassaCalculate(@Param('id') id: string) {
    return await this.kassaService.getKassaSum(id);
  }

  @Post('/')
  @ApiOperation({ summary: 'Method: creates new kassa' })
  @ApiCreatedResponse({
    description: 'The kassa was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData(@Body() data: CreateKassaDto) {
    const check = await this.kassaService.create(data);
    if (!check) {
      throw new HttpException('First you Should close kassa', HttpStatus.BAD_REQUEST);
    } else {
      return check;
    }
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Method: updating kassa' })
  @ApiOkResponse({
    description: 'Kassa was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeData(@Body() positionData: UpdateKassaDto, @Param('id') id: string): Promise<UpdateResult> {
    return await this.kassaService.change(positionData, id);
  }

  @Roles(UserRoleEnum.CASHIER, UserRoleEnum.BOSS)
  @Patch('/close-kassa/:id')
  @ApiOperation({ summary: 'Method: closing kassa' })
  @ApiOkResponse({
    description: 'Kassa was closed',
  })
  @HttpCode(HttpStatus.OK)
  async closeKassa(@Param('id') id: string, @Req() req) {
    const user = req.user;
    if (!user?.filial?.id) {
      throw new BadRequestException("You don't have filial!");
    }
    const kassa = await this.kassaService.getOne(id);

    if (user.filial.id !== kassa.filial.id && user.role !== UserRoleEnum.BOSS) {
      throw new BadRequestException("It's not your filial!");
    }

    if (user.role == UserRoleEnum.BOSS) {
      const kassa = req?.body?.kassa;
      if (kassa) {
        id = req.body.kassa.id;
      } else {
        throw new BadRequestException("Mr Boss, You don't give filial for find kassa!");
      }
    }

    await this.kassaService.closeKassa(id, req.user);
    const _kassa = await this.kassaService.create({ filial: user.filial.id });
    await this.kassaService.updateProgressOrdersNewKassa(_kassa?.['raw'][0].id);
    return await this.kassaService.GetOpenKassa(req.user.filial.id);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting kassa' })
  @ApiOkResponse({
    description: 'Kassa was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string) {
    return await this.kassaService.deleteOne(id);
  }
}
