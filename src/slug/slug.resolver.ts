import {Args, Query, Resolver} from "@nestjs/graphql";
import {SlugService} from "./slug.service";

@Resolver()
export class SlugResolver {
  constructor(private slug: SlugService) {}

  @Query(() => String, {nullable: false})
  slugify(@Args("text") text: string): string {
    return this.slug.slugify(text);
  }
}
