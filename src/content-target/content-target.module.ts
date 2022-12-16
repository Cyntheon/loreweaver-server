import {Module} from "@nestjs/common";
import {ContentTargetService} from "./content-target.service";

@Module({
  providers: [ContentTargetService],
  imports: [],
  exports: [ContentTargetService]
})
export class ContentTargetModule {}
