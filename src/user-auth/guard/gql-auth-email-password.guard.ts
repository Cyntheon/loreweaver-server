/* eslint-disable */
import {ExecutionContext, Injectable} from "@nestjs/common";
import {GqlExecutionContext} from "@nestjs/graphql";
import {AuthGuard} from "@nestjs/passport";

@Injectable()
export class GqlAuthEmailPasswordGuard extends AuthGuard("local-email-password") {
  public constructor() {
    super();
  }

  public getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext();

    request.body = ctx.getArgs().credentials;

    return request;
  }
}
