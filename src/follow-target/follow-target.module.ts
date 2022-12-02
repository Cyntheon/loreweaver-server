import {Module} from "@nestjs/common";
import {FollowTargetService} from "./follow-target.service";

@Module({
  providers: [FollowTargetService]
})
export class FollowTargetModule {}
