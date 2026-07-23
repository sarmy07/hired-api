/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/regsiter.dto';
import { LoginDto } from './dtos/login.dto';
import { CurrentUser } from 'src/common/decorators/current.user.decorator';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from './guards/jwt.auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@CurrentUser() user: User) {
    return user;
  }

  @Post('refresh')
  refreshTokens(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@CurrentUser() user: User) {
    return this.authService.logout(user.id);
  }
}
