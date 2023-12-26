import {
  Controller,
  Post,
  HttpCode,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiCreatedResponse,
  ApiTags,
  ApiOperation,
  ApiConsumes,
} from '@nestjs/swagger';
import { ExcelService } from './excel.service';
import { multerStorage } from '../../infra/helpers';
import { Public } from '../auth/decorators/public.decorator';
import { Body, Get, Put } from '@nestjs/common/decorators';
import { ImportExcelDto, UpdateExcelDto, UpdateProductExcelDto } from './dto';
import CreateProductExcDto from './dto/createProduct-excel';

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
  async createExcel(
    @UploadedFile() file: Express.Multer.File,
    @Body() bodyData: ImportExcelDto,
  ) {
    const data = await this.fileService.readExcel(file.path);
    console.log(bodyData);

    return data;
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
  async createProduct(
    @Param('partiyaID') id: string,
    @Body() data: CreateProductExcDto,
  ) {
    const response = await this.fileService.addProductToPartiya([data], id);

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
  async updateProduct(
    @Param('partiyaID') id: string,
    @Body() data: UpdateProductExcelDto,
  ) {
    const response = await this.fileService.updateProductsPartiya({
      newData: data.products,
      partiyaId: id,
    });

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
  async GetProducts(@Param('partiyaID') id: string) {
    const response = await this.fileService.readProducts(id);

    return response;
  }

  @Public()
  @Post('/product/:id')
  @ApiOperation({
    summary: 'Method: imports data and update products in the excel',
  })
  @ApiCreatedResponse({
    description: 'The data imported and saved to partiya successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async CreateProducts(@Param('partiyaID') id: string) {
    const response = await this.fileService.createProduct(id);

    return response;
  }
}
