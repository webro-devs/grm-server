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
import { ImportExcelDto, UpdateProductExcelDto } from './dto';
import { CreateProductDto } from '../product/dto';
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
    const data = await this.fileService.readExcelFile(file.path);
    console.log(bodyData);

    return data;
  }

  // @Public()
  // @Post('/')
  // @ApiConsumes('multipart/form-data')
  // @ApiOperation({ summary: 'Method: imports excel file and returns json data' })
  // @ApiCreatedResponse({
  //   description: 'The excel file imported and converted to json successfully',
  // })
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: multerStorage('uploads/excel'),
  //   }),
  // )
  // @HttpCode(HttpStatus.CREATED)
  // async createExcel(
  //   @UploadedFile() file: any,
  //   @Body() bodyData?: ImportExcelDto,
  // ) {
  //   console.log('asdasd');
  //   // const data = await this.fileService.uploadFile(file.path);
  //   // const reconstructed = await this.fileService.setModules(data);
  //   // const created = await this.fileService.createProduct(id, reconstructed);
  //   // const constructedDatas = excelDataParser(created.updatedDatas);

  //   // for (let i = 0; i < constructedDatas.length; i++) {
  //   //   constructedDatas[i].collection_exp =
  //   //     created.expense || 0 / constructedDatas.length || 0;
  //   // }

  //   return 'constructedDatas';
  // }

  @Public()
  @Put('/:partiyaID')
  @ApiOperation({
    summary: 'Method: imports data and save products in the excel',
  })
  @ApiCreatedResponse({
    description: 'The data imported and saved to partiya successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData(
    @Body() data: CreateProductExcDto,
    @Param('partiyaID') id: string,
  ) {
    console.log(data);
    const response = await this.fileService.createProduct(
      id,
      await this.fileService.setModules([data], true),
      false,
      true,
      false,
    );

    return data;
  }

  @Public()
  @Post('/saveProducts/:partiyaID')
  @ApiOperation({
    summary: 'Method: imports data(s) and save product(s) in the database.',
  })
  @ApiCreatedResponse({
    description: 'The data(s) imported and saved to database successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async creaateProducts(@Param('partiyaID') id: string) {
    const response = await this.fileService.createProduct(id, [], true);

    return response;
  }

  @Public()
  @Put('/updateProduct/:partiyaID')
  @ApiOperation({
    summary: 'Method: imports data and update products in the excel',
  })
  @ApiCreatedResponse({
    description: 'The data imported and saved to partiya successfully',
  })
  @HttpCode(HttpStatus.OK)
  async updateData(
    @Body() data: UpdateProductExcelDto,
    @Param('partiyaID') id: string,
  ) {
    const response = await this.fileService.updateProduct(data.products, id);

    return response;
  }
}
