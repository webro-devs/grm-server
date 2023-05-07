import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { REFRESH_TOKEN_USER } from './refresh-token-user.strategy';

@Injectable()
export class RefreshTokenUserGuard extends AuthGuard(REFRESH_TOKEN_USER) {}
