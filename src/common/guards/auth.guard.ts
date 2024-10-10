import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthConstants } from '../auth/auth.constants';
import { UserService } from '../users/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) { }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req: Request = await ctx.switchToHttp().getRequest();
    const token = req.headers.authorization?.split(' ')?.[1];

    try {
      const decodedPayload = await this.jwtService.verifyAsync(token, {
        secret: AuthConstants.JWT_SECRET,
      });

      const user = await this.userService.findById(
        decodedPayload.user.sub,
      );

      if (typeof user === "boolean") {
        return false;
      }

      req['user'] = {
        sub: user.id,
      };

      return true;
    } catch (error) {
      return false;
    }
  }
}
