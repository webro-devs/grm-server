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
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import { ApiCreatedResponse, ApiOkResponse, ApiTags, ApiOperation, OpenAPIObject } from '@nestjs/swagger';

import { CreateCollectionDto, UpdateCollectionDto, TrCollectionDto } from './dto';
import { Collection } from './collection.entity';
import { CollectionService } from './collection.service';
import { PaginationDto } from '../../infra/shared/dto';
import { Route } from '../../infra/shared/decorators/route.decorator';

@ApiTags('Collection')
@Controller('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Get('/')
  @ApiOperation({ summary: 'Method: returns all Collections' })
  @ApiOkResponse({
    description: 'The collections were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getData(@Route() route: string, @Query() query: PaginationDto) {
    return await this.collectionService.getAll({ ...query, route });
  }

  @Get('/transfer-collection')
  @ApiOperation({ summary: 'Method: returns all Collections' })
  @ApiOkResponse({
    description: 'The collections were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getCollectionTransfer(@Route() route: string, @Query() query: TrCollectionDto) {
    return await this.collectionService.remainingProductsByCollectionTransfer({ ...query });
  }

  @Get('/internet-shop')
  @ApiOperation({ summary: 'Method: returns all Collections' })
  @ApiOkResponse({
    description: 'The collections were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getDataInternetShop(@Route() route: string, @Query() query: PaginationDto) {
    return await this.collectionService.getAllInternetShop({ ...query, route });
  }

  @Get('/remaining-products')
  @ApiOperation({ summary: 'Method: returns all remaining products' })
  @ApiOkResponse({
    description: 'The remaining products were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getRemainingProductsByCollection(@Query() query) {
    return await this.collectionService.remainingProductsByCollection(query);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns single collection by id' })
  @ApiOkResponse({
    description: 'The collection was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getMe(@Param('id') id: string): Promise<Collection> {
    return this.collectionService.getOne(id);
  }

  @Post('/')
  @ApiOperation({ summary: 'Method: creates new Collection' })
  @ApiCreatedResponse({
    description: 'The collection was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData(@Body() data: CreateCollectionDto): Promise<Collection> {
    return await this.collectionService.create(data);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Method: updating collection' })
  @ApiOkResponse({
    description: 'Collection was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeData(@Body() CollectionData: UpdateCollectionDto, @Param('id') id: string): Promise<UpdateResult> {
    return await this.collectionService.change(CollectionData, id);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting collection' })
  @ApiOkResponse({
    description: 'Collection was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string) {
    return await this.collectionService.deleteOne(id);
  }
}
