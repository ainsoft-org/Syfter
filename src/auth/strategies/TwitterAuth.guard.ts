import { AuthGuard } from "@nestjs/passport";
import { ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class TwitterAuthGuard extends AuthGuard('twitter') {
  constructor(

  ) {
    super();
  }
  async canActivate(context: ExecutionContext | any) {
    const activate = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);

    return activate;
  }
}