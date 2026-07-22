import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import authConfig from '../config/authConfig';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,
    private readonly jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.headers.authorization.split('')[1];
    if (!token) throw new UnauthorizedException('no token provided');

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.authConfiguration.secret,
      });
      request['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException('invalid or expired token');
    }
    return true;
  }
}
