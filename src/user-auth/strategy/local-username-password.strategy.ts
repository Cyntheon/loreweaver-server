import {Injectable, UnauthorizedException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {User} from "@prisma/client";
import {Strategy} from "passport-local";
import {UserAuthService} from "../user-auth.service";

@Injectable()
export class LocalUsernamePasswordStrategy extends PassportStrategy(
  Strategy,
  "local-username-password"
) {
  public constructor(private readonly userAuth: UserAuthService) {
    super({
      usernameField: "username",
      passwordField: "password"
    });
  }

  public async validate(username: string, password: string): Promise<User> {
    const user = await this.userAuth.validateUserUsernamePassword({
      username,
      password
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
