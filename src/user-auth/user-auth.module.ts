import {forwardRef, Global, Module} from "@nestjs/common";
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {UserModule} from "../user/user.module";
import {ArgonService} from "./argon.service";
import {JwtAuthStrategy} from "./strategy/jwt-auth.strategy";
import {LocalEmailPasswordStrategy} from "./strategy/local-email-password.strategy";
import {LocalUsernamePasswordStrategy} from "./strategy/local-username-password.strategy";
import {UserAuthResolver} from "./user-auth.resolver";
import {UserAuthService} from "./user-auth.service";

@Global()
@Module({
  providers: [
    UserAuthService,
    UserAuthResolver,
    ArgonService,
    LocalUsernamePasswordStrategy,
    LocalEmailPasswordStrategy,
    JwtAuthStrategy
  ],
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.register({
      signOptions: {expiresIn: "24h"},
      secret: process.env.JWT_SECRET
    })
  ],
  exports: [UserAuthService, ArgonService]
})
export class UserAuthModule {}
