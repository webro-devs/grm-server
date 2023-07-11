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
import { ProductQueryDto } from '../../infra/shared/dto';
import { Route } from '../../infra/shared/decorators/route.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from '../../infra/shared/enum';
import { Put } from '@nestjs/common/decorators';

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
  async getData(
    @Route() route: string,
    @Query() query: ProductQueryDto,
    @Req() req,
  ) {
    return await this.productService.getAll(
      { limit: query.limit, page: query.page, route },
      req.where,
    );
  }

  @Get('/remaining-products')
  @ApiOperation({ summary: 'Method: returns remaining ofp products' })
  @ApiOkResponse({
    description: 'The remaining of products was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getRemainingProducts(@Req() req) {
    return this.productService.remainingProducts(req.where);
  }

  @Get('/remaining-products/all-filial')
  @ApiOperation({ summary: 'Method: returns remaining ofp products' })
  @ApiOkResponse({
    description: 'The remaining of products was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getRemainingProductsAllFilial(@Req() req) {
    return this.productService.getRemainingProductsForAllFilial();
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
  async saveData(@Body() data: CreateProductDto[]) {
    return await this.productService.create(data);
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
    return await this.productService.change(positionData, id);
  }

  @Patch('/internet-product-status/:id')
  @Roles(UserRoleEnum.SUPPER_MANAGER, UserRoleEnum.BOSS)
  @ApiOperation({ summary: 'Method: updating product isInternetShop' })
  @ApiOkResponse({
    description: 'isInternetShop was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeInternetProductStatus(
    @Body() { isInternetProduct },
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    return await this.productService.changeIsInternetShop(
      id,
      isInternetProduct,
    );
  }

  @Put('/internet-product/:id')
  @Roles(UserRoleEnum.SUPPER_MANAGER, UserRoleEnum.BOSS)
  @ApiOperation({ summary: 'Method: updating product internet product' })
  @ApiOkResponse({
    description: 'Product was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeInternetProduct(
    @Body() { data },
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    return await this.productService.changeMagazinProduct(data, id);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Method: deleting product' })
  @ApiOkResponse({
    description: 'Product was deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteData(@Param('id') id: string) {
    return await this.productService.deleteOne(id);
  }
}
