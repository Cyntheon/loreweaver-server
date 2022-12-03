import {Injectable} from "@nestjs/common";
import {Lore, Prisma, ContentTargetType, ShortcodeType} from "@prisma/client";
import {GraphQLError} from "graphql/error";
import {Override, PickPartial} from "../@types";
import {PrismaService} from "../prisma/prisma.service";
import {RealmService} from "../realm/realm.service";
import {ShortcodeService} from "../shortcode/shortcode.service";
import {SlugService} from "../slug/slug.service";
import {UserService} from "../user/user.service";
import {stringOrSetObjectToString} from "../util/stringOrSetObjectToString";

type LoreCreateArgs = Override<
  Prisma.LoreCreateArgs,
  {
    data: PickPartial<
      Prisma.LoreCreateInput,
      "baseSlug" | "slugDiscriminator" | "contentTarget"
    >;
  }
>;

@Injectable()
export class LoreService {
  constructor(
    private prisma: PrismaService,
    private slugService: SlugService,
    private shortcodeService: ShortcodeService,
    private userService: UserService,
    private realmService: RealmService
  ) {}

  async getLore(args: Prisma.LoreFindUniqueArgs): Promise<Lore | null> {
    return this.prisma.lore.findUnique(args);
  }

  calculateLoreSlug(args: {baseSlug: string; slugDiscriminator: number}) {
    return this.slugService.calculateSlug(
      args.baseSlug,
      args.slugDiscriminator
    );
  }

  async getLoreUrl(where: Prisma.LoreWhereUniqueInput): Promise<string> {
    const lore = await this.prisma.lore.findUnique({
      where,
      select: {
        author: true,
        realm: true,
        baseSlug: true,
        slugDiscriminator: true
      }
    });

    if (!lore) {
      throw new GraphQLError("Lore not found", {
        extensions: {code: "NOT_FOUND"}
      });
    }

    const authorSlug = this.userService.calculateUserSlug(lore.author);
    const realmSlug = this.calculateLoreSlug(lore);
    const loreSlug = this.realmService.calculateRealmSlug(lore.realm);

    return `/${authorSlug}/r/${realmSlug}/l/${loreSlug}`;
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

      const shortcode = await this.shortcodeService.createShortcode({
        data: {
          type: ShortcodeType.Lore,
          lore: {
            connect: where
          }
        }
      });

      return this.shortcodeService.getShortcodeUrl({id: shortcode.id});
    });
  }

  async findLowestAvailableDiscriminator({
    ignoreId,
    baseSlug,
    realmId
  }: {
    ignoreId?: string;
    baseSlug: string;
    realmId: string;
  }): Promise<number> {
    const loresWithSameBaseSlug = await this.getLores({
      where: {
        id: ignoreId ? {not: ignoreId} : undefined,
        realmId,
        baseSlug
      },
      select: {
        slugDiscriminator: true
      },
      orderBy: {
        slugDiscriminator: "asc"
      }
    });

    return this.slugService.findLowestAvailableDiscriminator(
      loresWithSameBaseSlug,
      {preSorted: true}
    );
  }

  async getLores(args: Prisma.LoreFindManyArgs): Promise<Lore[]> {
    return this.prisma.lore.findMany(args);
  }

  async createLore(args: LoreCreateArgs): Promise<Lore> {
    return this.prisma.$transaction(async (prisma) => {
      const baseSlug = this.slugService.slugify(args.data.title);

      const lore = await this.prisma.lore.create({
        ...args,
        data: {
          ...args.data,
          baseSlug,
          contentTarget: {
            create: {type: ContentTargetType.Lore}
          }
        }
      });

      await prisma.lore.update({
        where: {
          id: lore.id
        },
        data: {
          slugDiscriminator: await this.findLowestAvailableDiscriminator({
            ignoreId: lore.id,
            baseSlug,
            realmId: lore.realmId
          })
        }
      });

      return lore;
    });
  }

  async updateLore(args: Prisma.LoreUpdateArgs): Promise<Lore> {
    return this.prisma.$transaction(async (prisma) => {
      const lore = await prisma.lore.findUnique({
        where: args.where
      });

      if (!lore) {
        throw new GraphQLError("Lore not found", {
          extensions: {code: "NOT_FOUND"}
        });
      }

      const isSlugChanging = args.data.title && args.data.title !== lore.title;

      const baseSlug: string | undefined = isSlugChanging
        ? this.slugService.slugify(
            stringOrSetObjectToString(args.data.title as string | {set: string})
          )
        : undefined;

      const slugDiscriminator: number | undefined = isSlugChanging
        ? await this.findLowestAvailableDiscriminator({
            ignoreId: lore.id,
            baseSlug: baseSlug as string,
            realmId: lore.realmId
          })
        : undefined;

      return prisma.lore.update({
        ...args,
        data: {
          ...args.data,
          baseSlug,
          slugDiscriminator
        }
      });
    });
  }

  async deleteLore(args: Prisma.LoreDeleteArgs): Promise<Lore> {
    return this.prisma.lore.delete(args);
  }
}
