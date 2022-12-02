import {forwardRef, Module} from "@nestjs/common";
import {UserModule} from "../user/user.module";
import {UserProfileResolver} from "./user-profile.resolver";
import {UserProfileService} from "./user-profile.service";

@Module({
  providers: [UserProfileService, UserProfileResolver],
  imports: [forwardRef(() => UserModule)],
  exports: [UserProfileService]
})
export class UserProfileModule {}
