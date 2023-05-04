import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { KassaService } from './kassa.service';

@ApiTags('Kassa')
@Controller('kassa')
export class KassaController {
  constructor(private readonly kassaService: KassaService) {}
}
