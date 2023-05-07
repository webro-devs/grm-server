import {
  ExecutionContext,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Request } from 'express';

import { LoginDto } from '../../dto/index';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  canActivate(context: ExecutionContext) {
    const http = context.switchToHttp();
    const { body } = http.getRequest<Request>();

    const object = plainToInstance(LoginDto, body);
    const errors = validateSync(object);

    if (errors.length > 0) {
      throw new BadRequestException({
        statusCode: 400,
        message: errors.reduce((storage: string[], current) => {
          if (current.constraints) {
            storage.push(...Object.values(current.constraints));
          }
          return storage;
        }, []),
      });
    }

    return super.canActivate(context);
  }
}
