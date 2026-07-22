/*
https://docs.nestjs.com/providers#services
*/

import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dtos/regsiter.dto';
import { LoginDto } from './dtos/login.dto';
import { UsersService } from 'src/users/users.service';
import { HashingProvider } from './providers/hashing.provider';
import { JwtService } from '@nestjs/jwt';
import authConfig from './config/authConfig';
import type { ConfigType } from '@nestjs/config';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/common/enums/user.role.enum';

@Injectable()
export class AuthService {
  constructor(
    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,
    private readonly userService: UsersService,
    private readonly hashingProvider: HashingProvider,
    private readonly jwtService: JwtService,
  ) {}
  async register(dto: RegisterDto) {
    if (dto.role === Role.ADMIN) {
      throw new BadRequestException('Admin accounts cannot be self-registered');
    }

    const existing = await this.userService.findByEmail(dto.email);

    if (existing) throw new ConflictException('email already in use');

    const hash = await this.hashingProvider.hash(dto.password);

    const user = await this.userService.create({
      ...dto,
      password: hash,
    });

    const { password, ...rest } = user;

    const tokens = await this.generateTokens(user);

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      message: 'user created',
      rest,
      tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) throw new NotFoundException('user not found');

    const validPass = await this.hashingProvider.compare(
      dto.password,
      user.password,
    );

    if (!validPass) throw new UnauthorizedException('invlaid credentials');

    const { password, ...rest } = user;

    const tokens = await this.generateTokens(user);

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      rest,
      ...tokens,
    };
  }

  async logout(userId: string) {
    await this.userService.update(userId, { refreshToken: null });

    return {
      message: 'Logged out successfully',
    };
  }

  async refreshTokens(dto: RefreshTokenDto) {
    const payload = await this.jwtService.verifyAsync(dto.refreshToken, {
      secret: this.authConfiguration.refresh_secret,
    });

    const user = await this.userService.findOne(payload.id);
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException();
    }

    const match = await this.hashingProvider.compare(
      dto.refreshToken,
      user.refreshToken,
    );

    if (!match) throw new UnauthorizedException();

    const tokens = await this.generateTokens(user);

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashed = await this.hashingProvider.hash(refreshToken);

    await this.userService.update(userId, { refreshToken: hashed });
  }

  private async generateTokens(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.authConfiguration.secret,
        expiresIn: this.authConfiguration.expiresIn as any,
      }),

      this.jwtService.signAsync(payload, {
        secret: this.authConfiguration.refresh_secret,
        expiresIn: this.authConfiguration.refresh_expiresIn as any,
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
