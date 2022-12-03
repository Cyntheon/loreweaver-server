import {
  CreateOnePostArgs,
  DeleteOnePostArgs,
  FindUniquePostArgs,
  Post,
  UpdateOnePostArgs
} from "@generated/post";
import {Shortcode} from "@generated/shortcode";
import {
  Query,
  Resolver,
  ResolveField,
  Args,
  Mutation,
  Parent
} from "@nestjs/graphql";
import {ShortcodeService} from "../shortcode/shortcode.service";
import {PostService} from "./post.service";

@Resolver(() => Post)
export class PostResolver {
  constructor(
    private postService: PostService,
    private shortcodeService: ShortcodeService
  ) {}

  @Query(() => Post, {name: "post", nullable: true})
  async getPost(@Args() args: FindUniquePostArgs): Promise<Post | null> {
    return this.postService.getPost(args);
  }

  @Mutation(() => Post, {nullable: false})
  async createPost(@Args() args: CreateOnePostArgs): Promise<Post> {
    // @ts-ignore
    return this.postService.createPost(args);
  }

  @Mutation(() => Post, {nullable: false})
  async updatePost(@Args() args: UpdateOnePostArgs): Promise<Post> {
    // @ts-ignore
    return this.postService.updatePost(args);
  }

  @Mutation(() => Post, {nullable: false})
  async deletePost(@Args() args: DeleteOnePostArgs): Promise<Post> {
    return this.postService.deletePost(args);
  }

  @ResolveField(() => String, {name: "url", nullable: false})
  async getUrl(@Parent() post: Post): Promise<string> {
    return this.postService.getPostUrl({id: post.id});
  }

  @ResolveField(() => Shortcode, {name: "shortcode", nullable: true})
  async getShortcode(@Parent() post: Post): Promise<Shortcode | null> {
    if (!post.shortcodeId) {
      return null;
    }

    return this.shortcodeService.getShortcode({where: {id: post.shortcodeId}});
  }
}
