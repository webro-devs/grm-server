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
  Req,
  Put,
} from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { ApiCreatedResponse, ApiOkResponse, ApiTags, ApiOperation } from '@nestjs/swagger';

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
  @Public()
  @Get('/')
  @ApiOperation({ summary: 'Method: returns all products' })
  @ApiOkResponse({
    description: 'The products were returned successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getData(@Query() query: ProductQueryDto, @Route() route: string, @Req() req) {
    return await this.productService.getAll({ limit: query.limit, page: query.page, route }, req.where);
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
