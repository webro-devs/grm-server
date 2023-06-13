import {
  Controller,
  Post,
  HttpCode,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiCreatedResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { FileService } from './file.service';
import { MulterStorage } from '../../infra/helpers';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('File')
@Public()
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('/excel')
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
  async saveData(@UploadedFile() file: Express.Multer.File) {
    try {
      const data = await this.fileService.ExcelToJson(file.path);
      return data;
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }
}
