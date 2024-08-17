import { Body, Controller, HttpCode, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { CookieOptions, Response } from 'express';
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiNoContentResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginDto } from './dto';
import { Public } from './decorators/public.decorator';
import { User } from '../user/user.entity';
import { LocalAuthGuard } from './passport-stratagies/local/local-auth.guard';
import { ACCESS_TOKEN_USER } from './passport-stratagies/access-token-user/access-token-user.strategy';
import { RefreshTokenUserGuard } from './passport-stratagies/refresh-token-user/refresh-token-user.guard';
import { REFRESH_TOKEN_USER } from './passport-stratagies/refresh-token-user/refresh-token-user.strategy';

const accessTokenOptions: CookieOptions = {
  secure: true,
  sameSite: 'none',
  maxAge: 31536000000,
};
const refreshTokenOptions: CookieOptions = {
  ...accessTokenOptions,
  httpOnly: true,
};

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @HttpCode(200)
  @ApiNoContentResponse({
    description: 'New access, refresh tokens have been saved.',
  })
  @ApiBadRequestResponse({ description: 'Something went wrong from FE' })
  async login(@Req() { user }: { user: User }, @Res({ passthrough: true }) response: Response, @Body() _: LoginDto) {
    if (!(await this.authService.isValidUser(user.id))) {
      response.clearCookie(ACCESS_TOKEN_USER, accessTokenOptions);
      response.clearCookie(REFRESH_TOKEN_USER, refreshTokenOptions);
      throw new UnauthorizedException();
    }
    const accessToken = this.authService.getJWT('access', user.id);
    const refreshToken = this.authService.getJWT('refresh', user.id);
    response.cookie(ACCESS_TOKEN_USER, accessToken, accessTokenOptions);
    response.cookie(REFRESH_TOKEN_USER, refreshToken, refreshTokenOptions);
    return { accessToken, refreshToken, user };
  }

  @Public()
  @Post('/logout')
  @HttpCode(200)
  @ApiNoContentResponse({
    description: 'The user was logged out successfully',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(ACCESS_TOKEN_USER, accessTokenOptions);
    response.clearCookie(REFRESH_TOKEN_USER, refreshTokenOptions);
  }

  @Public()
  @UseGuards(RefreshTokenUserGuard)
  @Post('/refresh')
  @HttpCode(200)
  @ApiNoContentResponse({
    description: 'New access, refresh tokens have been saved.',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  async refresh(@Req() { user }: { user: User }, @Res({ passthrough: true }) response: Response) {
    if (!(await this.authService.isValidUser(user.id))) {
      response.clearCookie(ACCESS_TOKEN_USER, accessTokenOptions);
      response.clearCookie(REFRESH_TOKEN_USER, refreshTokenOptions);
      throw new UnauthorizedException();
    }
    const accessToken = this.authService.getJWT('access', user.id);
    const refreshToken = this.authService.getJWT('refresh', user.id);
    response.cookie(ACCESS_TOKEN_USER, accessToken, accessTokenOptions);
    response.cookie(REFRESH_TOKEN_USER, refreshToken, refreshTokenOptions);

    return { accessToken, refreshToken, user };
  }
}
