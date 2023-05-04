import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CollectionService } from './collection.service';

@ApiTags('Collection')
@Controller('collection')
export class CollectionController {
  constructor(private readonly adminService: CollectionService) {}
}
