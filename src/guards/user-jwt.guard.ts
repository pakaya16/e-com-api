import { Injectable, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class UserJwtGuard extends AuthGuard("user-jwt") {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    const isSellerAuth = this.reflector.getAllAndOverride<boolean>("isSellerAuth", [
      context.getHandler(),
      context.getClass()
    ]);

    if (isPublic) {
      request.decoratorData = {
        ...request.decoratorData,
        isPublic
      };
      return true;
    } else if (isSellerAuth) {
      request.decoratorData = {
        ...request.decoratorData,
        isSellerAuth
      };
      return true;
    }

    const response: any = super.canActivate(context);
    return response;
  }
}
