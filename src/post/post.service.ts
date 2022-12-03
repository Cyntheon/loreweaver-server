import {Injectable} from "@nestjs/common";
import {Post, Prisma, ContentTargetType, ShortcodeType} from "@prisma/client";
import {GraphQLError} from "graphql/error";
import {PrismaService} from "../prisma/prisma.service";
import {ShortcodeService} from "../shortcode/shortcode.service";

type PostCreateArgs = Omit<Prisma.PostCreateArgs, "data"> & {
  data: Prisma.PostCreateInput;
};

@Injectable()
export class PostService {
  constructor(
    private prisma: PrismaService,
    private shortcodeService: ShortcodeService
  ) {}

  async getPost(args: Prisma.PostFindUniqueArgs): Promise<Post | null> {
    return this.prisma.post.findUnique(args);
  }

  async getPostUrl(where: Prisma.PostWhereUniqueInput): Promise<string> {
    const post = await this.prisma.post.findUnique({
      where,
      select: {
        author: true,
        shortcodeId: true
      }
    });

    if (!post || !post.shortcodeId) {
      throw new GraphQLError("Post not found", {
        extensions: {code: "NOT_FOUND"}
      });
    }

    return `@${post.author.username}/p/${post.shortcodeId}`;
  }

  async getPosts(args: Prisma.PostFindManyArgs): Promise<Post[]> {
    return this.prisma.post.findMany(args);
  }

  async createPost(args: PostCreateArgs): Promise<Post> {
    return this.prisma.post.create({
      ...args,
      data: {
        ...args.data,
        shortcode: {
          create: {
            id: await this.shortcodeService.generateUniqueShortcode(),
            type: ShortcodeType.Post
          }
        },
        contentTarget: {
          create: {
            type: ContentTargetType.Post
          }
        }
      }
    });
  }

  async updatePost(args: Prisma.PostUpdateArgs): Promise<Post> {
    return this.prisma.post.update(args);
  }

  async deletePost(args: Prisma.PostDeleteArgs): Promise<Post> {
    return this.prisma.post.delete(args);
  }
}
