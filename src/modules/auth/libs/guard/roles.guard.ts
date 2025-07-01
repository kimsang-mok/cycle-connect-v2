import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const denyRoles = this.reflector.getAllAndOverride<(string | number)[]>(
      'denyRoles',
      [context.getClass(), context.getHandler()],
    );

    const request = context.switchToHttp().getRequest();
    const userRole = String(request.user?.role);

    if (denyRoles && denyRoles.map(String).includes(userRole)) {
      return false;
    }

    const roles = this.reflector.getAllAndOverride<(number | string)[]>(
      'roles',
      [context.getClass(), context.getHandler()],
    );

    return roles.map(String).includes(String(request.user?.role));
  }
}
