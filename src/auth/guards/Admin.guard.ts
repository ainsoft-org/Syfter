import { Injectable, ExecutionContext, UnauthorizedException, ForbiddenException } from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    const roles = user.user.roles;
    if (!roles.includes('admin') && !roles.includes('moderator')) {
      throw new ForbiddenException('Access denied');
    }
    return user;
  }
}