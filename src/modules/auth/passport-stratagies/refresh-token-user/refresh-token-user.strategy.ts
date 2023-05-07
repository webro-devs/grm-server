import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';

import { AuthService } from '../../auth.service';

export const REFRESH_TOKEN_USER = 'refresh_token_user';

@Injectable()
export class RefreshTokenUserStrategy extends PassportStrategy(
  Strategy,
  REFRESH_TOKEN_USER,
) {
  constructor(
    private readonly authService: AuthService,
    configService: ConfigService,
  ) {
    const jwtConfig = configService.getOrThrow('jwt');
    super({
      jwtFromRequest: (req: Request) => req.cookies[REFRESH_TOKEN_USER],
      ignoreExpiration: false,
      secretOrKey: jwtConfig.refreshTokenSecret,
    });
  }

  async validate(payload: { sub: string }) {
    const user = await this.authService.validateUserById(payload.sub);
    return user;
  }
}
