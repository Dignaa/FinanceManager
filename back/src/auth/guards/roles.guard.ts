import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../roles/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());

    if (!roles) {
      return true;  
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !roles.some(role => user.role === role)) {
      throw new ForbiddenException('You do not have the required role to access this resource');
    }
    return true;
  }
}
