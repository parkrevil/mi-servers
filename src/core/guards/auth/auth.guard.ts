import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { JwtPayload } from '@/auth/interfaces';
import { IS_PUBLIC_KEY } from '@/core/decorators';
import { UserService } from '@/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService, private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const [type, accessToken] = request.headers?.authorization?.split(' ') ?? [];

    if (type !== 'Bearer') {
      throw new UnauthorizedException();
    }

    if (!accessToken) {
      throw new UnauthorizedException();
    }

    const payload = await this.jwtService.verifyAsync<JwtPayload>(accessToken).catch(() => {
      throw new UnauthorizedException();
    });
    const user = await this.userService.findOne(payload.id);

    if (!user) {
      throw new UnauthorizedException();
    }

    request['user'] = user;

    return true;
  }
}
