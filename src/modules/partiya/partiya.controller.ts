import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PartiyaService } from './partiya.service';

@ApiTags('Partiya')
@Controller('partiye')
export class PartiyaController {
  constructor(private readonly partiyaService: PartiyaService) {}
}
