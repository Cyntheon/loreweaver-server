import {forwardRef, Module} from "@nestjs/common";
import {FollowTargetModule} from "../follow-target/follow-target.module";
import {UserModule} from "../user/user.module";
import {FollowService} from "./follow.service";
import {FollowResolver} from "./follow.resolver";

@Module({
  providers: [FollowService, FollowResolver],
  imports: [forwardRef(() => UserModule), forwardRef(() => FollowTargetModule)],
  exports: [FollowService]
})
export class FollowModule {}
