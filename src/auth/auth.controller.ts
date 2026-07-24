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
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'regsiter user' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'login user' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'get current user' })
  getMe(@CurrentUser() user: User) {
    return user;
  }

  @Post('refresh')
  @ApiOperation({ summary: 'refresh token' })
  refreshTokens(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiOperation({ summary: 'logout user' })
  logout(@CurrentUser() user: User) {
    return this.authService.logout(user.id);
  }
}
