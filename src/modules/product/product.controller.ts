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

import { CreateProductDto, UpdateProductDto } from './dto';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { PaginationDto } from '../../infra/shared/dto';
import { Route } from '../../infra/shared/decorators/route.decorator';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/')
  @ApiOperation({ summary: 'Method: returns all products' })
  @ApiOkResponse({
    description: 'The products were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getData(@Route() route: string, @Query() query: PaginationDto) {
    try {
      return await this.productService.getAll({ ...query, route });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Method: returns single product by id' })
  @ApiOkResponse({
    description: 'The product was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getMe(@Param('id') id: string): Promise<Product> {
    return this.productService.getOne(id);
  }

  @Post('/')
  @ApiOperation({ summary: 'Method: creates new product' })
  @ApiCreatedResponse({
    description: 'The product was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData(@Body() positionData: CreateProductDto) {
    try {
      return await this.productService.create(positionData);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Method: updating product' })
  @ApiOkResponse({
    description: 'Product was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeData(
    @Body() positionData: UpdateProductDto,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    try {
      return await this.productService.change(positionData, id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting product' })
  @ApiOkResponse({
    description: 'Product was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string) {
    try {
      return await this.productService.deleteOne(id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
