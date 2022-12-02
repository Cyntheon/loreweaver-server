import {Global, Module} from "@nestjs/common";
import {SlugService} from "./slug.service";
import {SlugResolver} from "./slug.resolver";

@Global()
@Module({
  providers: [SlugService, SlugResolver],
  imports: [],
  exports: [SlugService]
})
export class SlugModule {}
