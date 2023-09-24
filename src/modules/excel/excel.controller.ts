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
import { excelDataParser, multerStorage } from '../../infra/helpers';
import { Public } from '../auth/decorators/public.decorator';
import { Body, Put } from '@nestjs/common/decorators';
import { ImportExcelDto, UpdateExcelDto } from './dto';
import { CreateProductDto } from '../product/dto';

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
    const data = await this.fileService.uploadFile(file.path);
    return excelDataParser(data);
  }

  @Public()
  @Put('/:partiyaID')
  @ApiOperation({ summary: 'Method: imports data and save partiya' })
  @ApiCreatedResponse({
    description: 'The data imported and saved to partiya successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData(
    @Body() data: CreateProductDto,
    @Param('partiyaID') id: string,
  ) {
    const response = await this.fileService.createProduct(id, [data]);

    return response;
  }

  @Public()
  @Put('/multiple/:partiyaID')
  @ApiOperation({ summary: 'Method: imports datas and save partiya' })
  @ApiCreatedResponse({
    description: 'The data imported and saved to partiya successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveDatas(
    @Body() data: CreateProductDto[],
    @Param('partiyaID') id: string,
  ) {
    return await this.fileService.createProduct(id, data);
  }
}
