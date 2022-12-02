import {ContentType, ShortcodeType} from "@generated/prisma";
import {Injectable} from "@nestjs/common";
import {Prisma, Lore} from "@prisma/client";
import {GraphQLError} from "graphql/error";
import {PrismaService} from "../prisma/prisma.service";
import {ShortcodeService} from "../shortcode/shortcode.service";
import {SlugService} from "../slug/slug.service";

type LoreCreateArgs = Omit<Prisma.LoreCreateArgs, "data"> & {
  data: Prisma.LoreCreateInput;
};

@Injectable()
export class LoreService {
  constructor(
    private prisma: PrismaService,
    private slugService: SlugService,
    private shortcodeService: ShortcodeService
  ) {}

  async getLore(args: Prisma.LoreFindUniqueArgs): Promise<Lore | null> {
    return this.prisma.lore.findUnique(args);
  }

  async getLoreUrl(where: Prisma.LoreWhereUniqueInput): Promise<string> {
    const lore = await this.prisma.lore.findUnique({
      where,
      select: {
        author: true,
        realm: true,
        slug: true
      }
    });

    if (!lore) {
      throw new GraphQLError("Lore not found", {
        extensions: {code: "NOT_FOUND"}
      });
    }

    return `/@${lore.author.username}/r/${lore.realm.slug}/l/${lore.slug}`;
  }

  async getOrGenerateLoreShortcodeUrl(
    where: Prisma.LoreWhereUniqueInput
  ): Promise<string> {
    return this.prisma.$transaction(async (prisma) => {
      const lore = await prisma.lore.findUnique({
        where,
        select: {
          shortcodeId: true
        }
      });

      if (!lore) {
        throw new GraphQLError("Lore not found", {
          extensions: {code: "NOT_FOUND"}
        });
      }

      if (lore.shortcodeId) {
        return this.shortcodeService.getShortcodeUrl({id: lore.shortcodeId});
      }

      const updatedLore = await this.updateLore({
        where,
        data: {
          shortcode: {
            create: {
              id: await this.shortcodeService.generateUniqueShortcode(),
              type: ShortcodeType.Lore
            }
          }
        },
        select: {
          shortcodeId: true
        }
      });

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.shortcodeService.getShortcodeUrl({
        id: updatedLore.shortcodeId!
      });
    });
  }

  async getLores(args: Prisma.LoreFindManyArgs): Promise<Lore[]> {
    return this.prisma.lore.findMany(args);
  }

  async createLore(args: LoreCreateArgs): Promise<Lore> {
    const slug = this.slugService.slugify(args.data.title);

    return this.prisma.lore.create({
      ...args,
      data: {
        ...args.data,
        slug,
        content: {
          create: {type: ContentType.Lore}
        },
        contents: "{}"
      }
    });
  }

  async updateLore(args: Prisma.LoreUpdateArgs): Promise<Lore> {
    const newTitle: string | undefined =
      args.data.title &&
      (typeof args.data.title === "string"
        ? args.data.title
        : args.data.title.set);

    const slug: string | undefined =
      newTitle && this.slugService.slugify(newTitle);

    return this.prisma.lore.update({
      ...args,
      data: {
        ...args.data,
        slug
      }
    });
  }

  async deleteLore(args: Prisma.LoreDeleteArgs): Promise<Lore> {
    return this.prisma.lore.delete(args);
  }
}
