/* eslint-disable */
import {CanActivate, ExecutionContext, Injectable, mixin, SetMetadata} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {GqlExecutionContext} from "@nestjs/graphql";
import {UserService} from "../user.service";

const USER_SELF_GUARD_PARAM_NAME = "userSelfGuard_params";

export const UserSelfGuardParams = (paramName: string) =>
  SetMetadata(USER_SELF_GUARD_PARAM_NAME, paramName);

@Injectable()
export class UserSelfGuard implements CanActivate {
  public constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);

    const paramName = this.reflector.get<string>(
      USER_SELF_GUARD_PARAM_NAME,
      context.getHandler()
    ) || "where";

    const userId = ctx.getContext().req.user.id;
    const whereId = await this.userService.getUserId(ctx.getArgs()[paramName]);

    return userId === whereId;
  }
}
