import { Controller, Post, HttpCode, UseInterceptors, UploadedFile, HttpStatus, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiCreatedResponse, ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { ExcelService } from './excel.service';
import { deleteFile, multerStorage } from '../../infra/helpers';
import { Public } from '../auth/decorators/public.decorator';
import { Body, Delete, Get, Put } from '@nestjs/common/decorators';
import { ImportExcelDto, UpdateCollectionCostDto, UpdateExcelDto, UpdateModelCostDto, UpdateProductExcelDto } from './dto';
import CreateProductExcDto from './dto/createProduct-excel';
import { CreateQrBaseDto } from '../qr-base/dto';

@ApiTags('Excel')
@Controller('excel')
export class ExcelController {
  constructor(private readonly fileService: ExcelService) {}

  @Public()
  @Post('/')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Method: imports excel file and returns json data' })
  @ApiCreatedResponse({
    description: 'The excel file imported and converted to json successfully',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multerStorage('uploads/excel'),
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  async createExcel(@UploadedFile() file: Express.Multer.File, @Body() bodyData: ImportExcelDto) {
    const data = this.fileService.readExcelFile(file.path);

    return await this.fileService.createWithCodeExcel(data, bodyData.partiyaId);
  }

  @Public()
  @Post('/single/:id')
  @ApiOperation({
    summary: 'Method: imports data and update products in the excel',
  })
  @ApiCreatedResponse({
    description: 'The data imported and saved to partiya successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Param('id') id: string, @Body() data: CreateProductExcDto) {
    const response = await this.fileService.addProductToPartiya([data], id);

    return response;
  }

  @Public()
  @Get('/:id')
  @ApiOperation({
    summary: 'Method: imports data and update products in the excel',
  })
  @ApiCreatedResponse({
    description: 'The data imported and saved to partiya successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async GetProducts(@Param('id') id: string) {
    const response = await this.fileService.readProducts(id);

    return response;
  }

  @Public()
  @Put('/single/:id')
  @ApiOperation({
    summary: 'Method: imports data and update products in the excel',
  })
  @ApiCreatedResponse({
    description: 'The data imported and saved to partiya successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async updateProduct(@Param('id') id: string, @Body() data: UpdateProductExcelDto) {
    const response = await this.fileService.updateProduct(data, id);

    return response;
  }

  @Public()
  @Post('/product/:id')
  @ApiOperation({
    summary: 'Method: imports data and update products in the baza',
  })
  @ApiCreatedResponse({
    description: 'The data imported and saved to baza successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async CreateProducts(@Param('id') id: string, @Body() data) {
    console.log(data);

    const response = await this.fileService.createProduct(id, data?.filial);

    return response;
  }

  @Public()
  @Get('/product/:id')
  @ApiOperation({
    summary: 'Method: Get product by id with params',
  })
  @ApiCreatedResponse({
    description: 'The data come successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async getOneProduct(@Param('id') id: string) {
    const response = await this.fileService.getOne(id);

    return response;
  }

  @Public()
  @Delete('/product/:id')
  @ApiOperation({
    summary: 'Method: Get product by id with params',
  })
  @ApiCreatedResponse({
    description: 'The data come successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async DeleteProduct(@Param('id') id: string) {
    const response = await this.fileService.delete(id);

    return response;
  }

  @Public()
  @Post('/qr-code/:id')
  @ApiOperation({
    summary: 'Method: imports data and update products in the baza',
  })
  @ApiCreatedResponse({
    description: 'The data imported and saved to baza successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async CreateProductsQr(@Param('id') id: string, @Body() data: CreateQrBaseDto) {
    const response = await this.fileService.createWithCode(data, id);

    return response;
  }

  @Public()
  @Get('/qr-code/:id/:code')
  @ApiOperation({
    summary: 'Method: imports data and update products in the baza',
  })
  @ApiCreatedResponse({
    description: 'The data imported and saved to baza successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async CHechQr(@Param('code') code: string, @Param('id') id: string) {
    const response = await this.fileService.checkProductCode({ code, id });

    return response;
  }

  @Put('/collection/:id')
  @ApiOperation({
    summary: '',
  })
  @ApiCreatedResponse({
    description: '',
  })
  @HttpCode(HttpStatus.OK)
  async updateCollectionCost(@Param('id') id: string, @Body() data: UpdateCollectionCostDto) {
    const response = await this.fileService.updateCollectionCost({
      id: data.collectionId,
      cost: data.cost,
      partiyaId: id,
    });

    return response;
  }

  @Put('/model/:id')
  @ApiOperation({
    summary: '',
  })
  @ApiCreatedResponse({
    description: '',
  })
  @HttpCode(HttpStatus.OK)
  async updateModelCost(@Param('id') id: string, @Body() data: UpdateModelCostDto) {
    const response = await this.fileService.updateModelCost({
      id: data.modelId,
      cost: data.cost,
      partiyaId: id,
    });

    return response;
  }

  @Get('/model/:id/:modelId')
  @ApiOperation({
    summary: 'dfasdfadgafgasdfasdfasd',
  })
  @ApiCreatedResponse({
    description: 'asdsfgasdfasdfasdf',
  })
  @HttpCode(HttpStatus.OK)
  async getModell(@Param('id') id: string, @Param('modelId') modelId: string) {
    const response = await this.fileService.readProductsByModel(id, modelId);

    return response;
  }
}
