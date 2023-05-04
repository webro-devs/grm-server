import { Repository } from 'typeorm';

import { Permission } from './permission.entity';

export class PermissionRepository extends Repository<Permission> {}
