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

import { CreateCountryDto, UpdateCountryDto } from './dto';
import { Country } from './country.entity';
import { CountryService } from './country.service';
import { PaginationDto } from '../../infra/shared/dto';
import { Route } from '../../infra/shared/decorators/route.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from '../../infra/shared/enum';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Country')
@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Public()
  @Get('/all-reference')
  @ApiOperation({ summary: 'Method: returns all reference' })
  @ApiOkResponse({
    description: 'The reference were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getData() {
    return await this.countryService.getAllSp();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns single country by id' })
  @ApiOkResponse({
    description: 'The country was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getMe(@Param('id') id: string): Promise<Country> {
    return this.countryService.getOne(id);
  }

  @Post('/')
  @Roles(UserRoleEnum.BOSS, UserRoleEnum.SUPPER_MANAGER, UserRoleEnum.MANAGER)
  @ApiOperation({ summary: 'Method: creates new country' })
  @ApiCreatedResponse({
    description: 'The country was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData(@Body() data: CreateCountryDto): Promise<Country> {
    return await this.countryService.create(data);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Method: updating country' })
  @ApiOkResponse({
    description: 'Country was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeData(
    @Body() data: UpdateCountryDto,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    return await this.countryService.change(data, id);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting country' })
  @ApiOkResponse({
    description: 'Country was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string) {
    return await this.countryService.deleteOne(id);
  }
}
