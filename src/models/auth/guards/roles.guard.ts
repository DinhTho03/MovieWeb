import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const [req] = context.getArgs();
    const token = this.extractToken(req);
    if (!token) {
      return false;
    }
    const decodedToken = this.jwtService.decode(token) as any;
    if (!decodedToken) {
      return false;
    }
    const user = decodedToken;
    req.user = decodedToken;
    const requiredRoles =
      this.reflector.get<string[]>('roleId', context.getHandler()) || [];
    return requiredRoles.some((role) => user.roleId?.includes(role));
  }
  private extractToken(request: any): string | null {
    const authorizationHeader = request.headers.authorization;
    if (authorizationHeader && authorizationHeader.split(' ')[0] === 'Bearer') {
      return authorizationHeader.split(' ')[1];
    }
    return null;
  }
}
