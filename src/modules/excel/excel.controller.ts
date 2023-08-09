import {
  Controller,
  Post,
  HttpCode,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  HttpException,
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
import { Body, Put } from '@nestjs/common/decorators';
import { ImportExcelDto } from './dto';

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
    const data = await this.fileService.uploadExecl(
      file.path,
      bodyData.partiyaId,
    );
    return data;
  }

  @Public()
  @Put('/:partiyaID')
  @ApiOperation({ summary: 'Method: imports data and save partiya' })
  @ApiCreatedResponse({
    description: 'The data imported and saved to partiya successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async saveData(@Body() data, @Param('partiyaID') id: string) {
    const response = await this.fileService.jsonToExcel(data, id);
    return response;
  }
}
