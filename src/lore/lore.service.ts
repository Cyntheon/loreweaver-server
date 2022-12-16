import {Injectable} from "@nestjs/common";
import {
  Lore,
  Prisma,
  ContentTargetType,
  ShortcodeType,
  User,
  Realm,
  Shortcode
} from "@prisma/client";
import {GraphQLError} from "graphql/error";
import {Override, PickPartial, PrismaCreateArgs} from "../@types";
import {ContentTargetService} from "../content-target/content-target.service";
import {PrismaService} from "../prisma/prisma.service";
import {RealmService} from "../realm/realm.service";
import {ShortcodeService} from "../shortcode/shortcode.service";
import {SlugService} from "../slug/slug.service";
import {UserService} from "../user/user.service";
import {unpackStringFromSetObject} from "../util/unpack-string-from-set-object";

type LoreCreateArgs = PrismaCreateArgs<"Lore", "slug" | "contentTarget">;

@Injectable()
export class LoreService {
  constructor(
    private prisma: PrismaService,
    private slugService: SlugService,
    private shortcodeService: ShortcodeService,
    private contentTargetService: ContentTargetService,
    private userService: UserService,
    private realmService: RealmService
  ) {}

  async getLore(args: Prisma.LoreFindUniqueArgs): Promise<Lore | null> {
    return this.prisma.lore.findUnique(args);
  }

  async getLoreUrl(where: Prisma.LoreWhereUniqueInput): Promise<string> {
    const lore = (await this.getLore({
      where,
      select: {
        author: true,
        realm: true,
        baseSlug: true,
        slugDiscriminator: true
      }
    })) as {author: User; realm: Realm} & Lore;

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

  async getOrGenerateLoreShortcode(
    where: Prisma.LoreWhereUniqueInput
  ): Promise<Shortcode> {
    return this.prisma.$transaction(async (prisma) => {
      const lore = (await this.getLore({
        where,
        select: {
          shortcode: true
        }
      })) as ({shortcode: Shortcode} & Lore) | null;

      if (!lore) {
        throw new GraphQLError("Lore not found", {
          extensions: {code: "NOT_FOUND"}
        });
      }

      if (lore.shortcodeId) {
        return lore.shortcode;
      }

      return this.shortcodeService.createShortcode({
        data: {
          type: ShortcodeType.Lore,
          lore: {
            connect: where
          }
        }
      });
    });
  }

  async getManyLores(args: Prisma.LoreFindManyArgs): Promise<Lore[]> {
    return this.prisma.lore.findMany(args);
  }

  async createLore(args: LoreCreateArgs): Promise<Lore> {
    return this.prisma.$transaction(async (prisma) => {
      const baseSlug = this.slugService.slugify(args.data.title);

      const contentTarget = await this.contentTargetService.createContentTarget(
        {
          data: {
            type: ContentTargetType.Lore
          }
        }
      );

      const slug = await this.

      const lore = await this.prisma.lore.create({
        ...args,
        data: {
          ...args.data,
          baseSlug,
          contentTarget: {
            connect: {id: contentTarget.id}
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

      const newTitle = unpackStringFromSetObject(
        args.data.title as string | {set: string}
      );
      const newSlug = this.slugService.slugify(newTitle);
      const isSlugChanging = args.data.title && newSlug !== lore.baseSlug;
      const getSlugDiscriminator = async () =>
        this.findLowestAvailableDiscriminator({
          ignoreId: lore.id,
          baseSlug: newSlug,
          realmId: lore.realmId
        });

      return prisma.lore.update({
        ...args,
        data: {
          ...args.data,
          baseSlug: isSlugChanging ? newSlug : undefined,
          slugDiscriminator: isSlugChanging
            ? await getSlugDiscriminator()
            : undefined
        }
      });
    });
  }

  async deleteLore(args: Prisma.LoreDeleteArgs): Promise<Lore> {
    return this.prisma.lore.delete(args);
  }
}
