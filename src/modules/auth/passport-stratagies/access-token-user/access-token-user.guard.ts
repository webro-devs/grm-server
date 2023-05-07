import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { ACCESS_TOKEN_USER } from './access-token-user.strategy';
import { PUBLIC_KEY } from '../../decorators/public.decorator';

@Injectable()
export class AccessTokenUserGuard extends AuthGuard(ACCESS_TOKEN_USER) {
  constructor(private readonly reflector: Reflector) {
    super(reflector);
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    return super.canActivate(context);
  }
}
