import {Module} from "@nestjs/common";
import {CollectionResolver, CollectionService, CollectionSlugService} from ".";
import {SlugModule} from "../slug";

@Module({
  providers: [CollectionService, CollectionResolver],
  imports: [SlugModule],
  exports: [CollectionService, CollectionSlugService]
})
export class CollectionModule {}
