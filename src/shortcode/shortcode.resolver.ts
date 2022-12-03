import {
  CreateOneShortcodeArgs,
  FindUniqueShortcodeArgs,
  Shortcode,
  UpdateOneShortcodeArgs
} from "@generated/shortcode";
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver
} from "@nestjs/graphql";
import {ShortcodeService} from "./shortcode.service";

@Resolver(() => Shortcode)
export class ShortcodeResolver {
  constructor(private shortcodeService: ShortcodeService) {}

  @Query(() => Shortcode, {name: "shortcode", nullable: true})
  async getShortcode(
    @Args() args: FindUniqueShortcodeArgs
  ): Promise<Shortcode | null> {
    return this.shortcodeService.getShortcode(args);
  }

  @Mutation(() => Shortcode, {nullable: false})
  async createShortcode(
    @Args() args: CreateOneShortcodeArgs
  ): Promise<Shortcode> {
    // @ts-ignore
    return this.shortcodeService.createShortcode(args);
  }

  @Mutation(() => Shortcode, {nullable: false})
  async updateShortcode(
    @Args() args: UpdateOneShortcodeArgs
  ): Promise<Shortcode> {
    // @ts-ignore
    return this.shortcodeService.updateShortcode(args);
  }

  @Mutation(() => Shortcode, {nullable: false})
  async deleteShortcode(
    @Args() args: FindUniqueShortcodeArgs
  ): Promise<Shortcode> {
    return this.shortcodeService.deleteShortcode(args);
  }

  @ResolveField(() => String, {name: "url", nullable: false})
  getUrl(@Parent() shortcode: Shortcode): string {
    return this.shortcodeService.getShortcodeUrl(shortcode);
  }
}
