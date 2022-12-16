import {Global, Module} from "@nestjs/common";
import {DiscriminatorService} from "./discriminator.service";
import {SlugService} from "./slug.service";
import {SlugResolver} from "./slug.resolver";

@Module({
  providers: [SlugService, DiscriminatorService, SlugResolver],
  imports: [],
  exports: [SlugService, DiscriminatorService]
})
export class SlugModule {}
