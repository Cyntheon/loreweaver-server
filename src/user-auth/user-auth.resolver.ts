import {UserAuth} from "@generated/user-auth";
import {UseGuards} from "@nestjs/common";
import {Args, Context, Mutation, Resolver} from "@nestjs/graphql";
import {AuthContext} from "./@types";
import {GqlAuthEmailPasswordGuard} from "./guard/gql-auth-email-password.guard";
import {GqlAuthUsernamePasswordGuard} from "./guard/gql-auth-username-password.guard";
import {LoginCredentialsEmailPasswordInput} from "./input/login-credentials-email-password.input";
import {LoginCredentialsUsernamePasswordInput} from "./input/login-credentials-username-password.input";
import {LoginResponse} from "./output/login-response.output";
import {RefreshResponse} from "./output/refresh-response.output";
import {UserAuthService} from "./user-auth.service";

@Resolver(() => UserAuth)
export class UserAuthResolver {
  constructor(private authService: UserAuthService) {}

  @Mutation(() => LoginResponse)
  @UseGuards(GqlAuthUsernamePasswordGuard)
  async logInViaUsernamePassword(
    @Args("credentials") credentials: LoginCredentialsUsernamePasswordInput,
    @Context() context: AuthContext
  ): Promise<LoginResponse> {
    return this.authService.login(context.user);
  }

  @Mutation(() => LoginResponse)
  @UseGuards(GqlAuthEmailPasswordGuard)
  async logInViaEmailPassword(
    @Args("credentials") credentials: LoginCredentialsEmailPasswordInput,
    @Context() context: AuthContext
  ): Promise<LoginResponse> {
    return this.authService.login(context.user);
  }

  @Mutation(() => RefreshResponse)
  async refreshAccessToken(
    @Args("refreshToken") refreshToken: string
  ): Promise<RefreshResponse> {
    return this.authService.refresh(refreshToken);
  }
}
