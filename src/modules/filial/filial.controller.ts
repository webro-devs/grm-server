import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FilialService } from './filial.service';

@ApiTags('Filial')
@Controller('filial')
export class FilialController {
  constructor(private readonly filialService: FilialService) {}
}
