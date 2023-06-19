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
import { ApiCreatedResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { ExcelService } from './excel.service';
import { MulterStorage } from '../../infra/helpers';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Excel')
@Controller('excel')
export class ExcelController {
  constructor(private readonly fileService: ExcelService) {}

  @Public()
  @Post('/:partiyaID')
  @ApiOperation({ summary: 'Method: imports excel file and returns json data' })
  @ApiCreatedResponse({
    description: 'The excel file imported and converted to json successfully',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: MulterStorage('uploads/excel'),
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  async saveData(
    @UploadedFile() file: Express.Multer.File,
    @Param('partiyaID') id: string,
  ) {
    try {
      const data = await this.fileService.uploadExecl(file.path, id);
      return data;
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }
}
