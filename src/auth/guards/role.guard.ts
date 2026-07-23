import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/user.role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<Role[]>(ROLES_KEY, context.getHandler());

    if (!roles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!roles.includes(user.role)) {
      throw new ForbiddenException(
        'You do not have permission to perform this action',
      );
    }
    return true;
  }
}
