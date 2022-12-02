import {Injectable, UnauthorizedException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {User} from "@prisma/client";
import {Strategy} from "passport-local";
import {LoginCredentialsEmailPassword} from "../@types";
import {UserAuthService} from "../user-auth.service";

@Injectable()
export class LocalEmailPasswordStrategy extends PassportStrategy(
  Strategy,
  "local-email-password"
) {
  public constructor(private readonly userAuth: UserAuthService) {
    super({
      usernameField: "email",
      passwordField: "password"
    });
  }

  public async validate(email: string, password: string): Promise<User> {
    const user = await this.userAuth.validateUserEmailPassword({
      email,
      password
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
