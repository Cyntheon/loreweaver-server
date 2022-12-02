import {
  CreateOneShortcodeArgs,
  FindUniqueShortcodeArgs,
  Shortcode,
  UpdateOneShortcodeArgs
} from "@generated/shortcode";
import {Args, Mutation, Query, Resolver} from "@nestjs/graphql";
import {ShortcodeService} from "./shortcode.service";

@Resolver(() => Shortcode)
export class ShortcodeResolver {
  constructor(private shortcodes: ShortcodeService) {}

  @Query(() => Shortcode, {name: "shortcode", nullable: true})
  async getShortcode(
    @Args() args: FindUniqueShortcodeArgs
  ): Promise<Shortcode | null> {
    return this.shortcodes.getShortcode(args);
  }

  @Mutation(() => Shortcode, {nullable: false})
  async createShortcode(
    @Args() args: CreateOneShortcodeArgs
  ): Promise<Shortcode> {
    return this.shortcodes.createShortcode(args);
  }

  @Mutation(() => Shortcode, {nullable: false})
  async updateShortcode(
    @Args() args: UpdateOneShortcodeArgs
  ): Promise<Shortcode> {
    return this.shortcodes.updateShortcode(args);
  }

  @Mutation(() => Shortcode, {nullable: false})
  async deleteShortcode(
    @Args() args: FindUniqueShortcodeArgs
  ): Promise<Shortcode> {
    return this.shortcodes.deleteShortcode(args);
  }
}
