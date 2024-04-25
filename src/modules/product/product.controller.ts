import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { In, UpdateResult } from 'typeorm';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateProductDto, UpdateInternetShopProductDto, UpdateProductDto } from './dto';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { ProductQueryDto } from '../../infra/shared/dto';
import { Route } from '../../infra/shared/decorators/route.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from '../../infra/shared/enum';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Roles(UserRoleEnum.SELLER, UserRoleEnum.CASHIER, UserRoleEnum.BOSS, UserRoleEnum.CLIENT, UserRoleEnum.SUPPER_MANAGER, UserRoleEnum.MANAGER)
  @Get('/')
  @ApiOperation({ summary: 'Method: returns all products' })
  @ApiOkResponse({
    description: 'The products were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getData(@Query() query: ProductQueryDto, @Route() route: string, @Req() req) {
    return await this.productService.getAll({ limit: query.limit, page: query.page, route }, req.where, req.user);
  }

  @Public()
  @Get('/internet-shop')
  @ApiOperation({ summary: 'Method: returns all products for internet shop' })
  @ApiOkResponse({
    description: 'The products were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getDataInternetShop(@Query() query: ProductQueryDto, @Route() route: string, @Req() req) {
    req.where.isInternetShop = true;

    if (query?.modelId && typeof query?.modelId == 'string' && typeof JSON.parse(query?.modelId) == 'object') {
      req.where.model = { title: In(JSON.parse(query.modelId)) };
    }

    if (query?.collectionId && typeof query.collectionId == 'string' && typeof JSON.parse(query?.collectionId) == 'object') {
      if(req.where.model){
        req.where.model.collection = { title: In(JSON.parse(query.collectionId)) };
      } else {
        req.where.model = {
          collection: { title: In(JSON.parse(query.collectionId)) }
        }
      }
    }
    return await this.productService.getAll({ limit: query.limit, page: query.page, route }, req.where, req.user);
  }
  @Public()
  @Get('/internet-shop/supports')
  @ApiOperation({ summary: 'Method: returns all product supports for internet shop' })
  @ApiOkResponse({
    description: 'The product supports were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getDataInternetShopSupports(@Query() query: { model: string } ) {
    return (await this.productService.getSupports(query?.model))[0];
  }

  @Get('/baza')
  @ApiOperation({ summary: 'Method: returns all products' })
  @ApiOkResponse({
    description: 'The products were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getBaza(@Query() query: ProductQueryDto, @Route() route: string) {
    return await this.productService.getBaza({
      limit: query.limit,
      page: query.page,
      route,
    });
  }

  @Get('/shop-accounting')
  @ApiOperation({ summary: 'Method: returns I-Shop products accounting' })
  @ApiOkResponse({
    description: 'The I-Shop products accounting were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getIShopAccounting(@Query() query: { by: string }) {
    const response = await this.productService.getIShopAccounting(query);
    return { total_sold: +response[0].sold_shop_products, percentage: +response[0].percentage_sold, total_sold_first: +response[0].sold_shop_products_first };
  }

  @Get('/max-price')
  @ApiOperation({ summary: 'Method: returns all products' })
  @ApiOkResponse({
    description: 'The products were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getMaxPrice() {
    return await this.productService.getMaxPrice();
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

  @Get('/code/:code')
  @ApiOperation({ summary: 'Method: returns remaining ofp products' })
  @ApiOkResponse({
    description: 'The remaining of products was returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getWithCode(@Param('code') code: string) {
    return await this.productService.getByCode(code);
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
    return await this.productService.getOne(id);
  }

  @Post('/')
  @ApiOperation({ summary: 'Method: creates new products' })
  @ApiCreatedResponse({
    description: 'The products was created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData(@Body() data: CreateProductDto[]) {
    return await this.productService.create(data);
  }

  @Patch('/internet-product-status')
  @Roles(UserRoleEnum.SUPPER_MANAGER, UserRoleEnum.BOSS)
  @ApiOperation({ summary: 'Method: updating product isInternetShop' })
  @ApiOkResponse({
    description: 'isInternetShop was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeInternetProductStatus(@Body() { ids }: { ids: string[] }): Promise<UpdateResult> {
    return await this.productService.changeIsInternetShop(ids);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Method: updating product' })
  @ApiOkResponse({
    description: 'Product was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeData(@Body() positionData: UpdateProductDto, @Param('id') id: string): Promise<UpdateResult> {
    return await this.productService.change(positionData, id);
  }

  @Put('/internet-product/:id')
  @Roles(UserRoleEnum.SUPPER_MANAGER, UserRoleEnum.BOSS)
  @ApiOperation({ summary: 'Method: updating product internet product' })
  @ApiOkResponse({
    description: 'Product was changed',
  })
  @HttpCode(HttpStatus.OK)
  async changeInternetProduct(@Body() data: UpdateInternetShopProductDto, @Param('id') id: string): Promise<UpdateResult> {
    return await this.productService.changeInternetShopProduct(data, id);
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
