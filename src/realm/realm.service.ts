import {FollowTargetType, ShortcodeType} from "@generated/prisma";
import {Injectable} from "@nestjs/common";
import {Prisma, Realm} from "@prisma/client";
import {GraphQLError} from "graphql/error";
import {Override, PickPartial} from "../@types";
import {LoreService} from "../lore/lore.service";
import {PrismaService} from "../prisma/prisma.service";
import {ShortcodeService} from "../shortcode/shortcode.service";
import {SlugService} from "../slug/slug.service";
import {UserService} from "../user/user.service";

type RealmCreateArgs = Override<
  Prisma.RealmCreateArgs,
  {
    data: PickPartial<
      Prisma.RealmCreateInput,
      "baseSlug" | "slugDiscriminator" | "followTarget"
    >;
  }
>;

@Injectable()
export class RealmService {
  constructor(
    private prisma: PrismaService,
    private slugService: SlugService,
    private shortcodeService: ShortcodeService,
    private userService: UserService,
    private loreService: LoreService
  ) {}

  async getRealm(args: Prisma.RealmFindUniqueArgs): Promise<Realm | null> {
    return this.prisma.realm.findUnique(args);
  }

  calculateRealmSlug(args: {baseSlug: string; slugDiscriminator: number}) {
    return this.slugService.calculateSlug(
      args.baseSlug,
      args.slugDiscriminator
    );
  }

  async getRealmUrl(where: Prisma.RealmWhereUniqueInput): Promise<string> {
    const realm = await this.prisma.realm.findUnique({
      where,
      select: {
        author: true,
        baseSlug: true,
        slugDiscriminator: true
      }
    });

    if (!realm) {
      throw new GraphQLError("Realm not found", {
        extensions: {code: "NOT_FOUND"}
      });
    }

    const userSlug = this.userService.calculateUserSlug(realm.author);
    const realmSlug = this.calculateRealmSlug(realm);

    return `/${userSlug}/r/${realmSlug}`;
  }

  async getOrGenerateRealmShortcodeUrl(
    where: Prisma.RealmWhereUniqueInput
  ): Promise<string> {
    return this.prisma.$transaction(async (prisma) => {
      const realm = await prisma.realm.findUnique({
        where,
        select: {
          shortcodeId: true
        }
      });

      if (!realm) {
        throw new GraphQLError("Realm not found", {
          extensions: {code: "NOT_FOUND"}
        });
      }

      if (realm.shortcodeId) {
        return this.shortcodeService.getShortcodeUrl({id: realm.shortcodeId});
      }

      const updatedRealm = await this.updateRealm({
        where,
        data: {
          shortcode: {
            create: {
              id: await this.shortcodeService.generateUniqueShortcode(),
              type: ShortcodeType.Realm
            }
          }
        },
        select: {
          shortcodeId: true
        }
      });

      return this.shortcodeService.getShortcodeUrl({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        id: updatedRealm.shortcodeId!
      });
    });
  }

  async findLowestAvailableDiscriminator({
    ignoreId,
    baseSlug,
    authorId
  }: {
    ignoreId?: string;
    baseSlug: string;
    authorId: string;
  }): Promise<number> {
    const realmsWithSameBaseSlug = await this.getRealms({
      where: {
        id: ignoreId ? {not: ignoreId} : undefined,
        authorId,
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
      realmsWithSameBaseSlug,
      {preSorted: true}
    );
  }

  async getRealms(args: Prisma.RealmFindManyArgs): Promise<Realm[]> {
    return this.prisma.realm.findMany(args);
  }

  async createRealm(args: RealmCreateArgs): Promise<Realm> {
    return this.prisma.$transaction(async (prisma) => {
      const baseSlug = this.slugService.slugify(args.data.title);

      const realm = await prisma.realm.create({
        ...args,
        data: {
          ...args.data,
          baseSlug,
          followTarget: {
            create: {
              type: FollowTargetType.Realm
            }
          }
        }
      });

      await prisma.realm.update({
        where: {id: realm.id},
        data: {
          slugDiscriminator: await this.findLowestAvailableDiscriminator({
            ignoreId: realm.id,
            baseSlug,
            authorId: realm.authorId
          })
        }
      });

      await this.loreService.createLore({
        data: {
          realm: {connect: {id: realm.id}},
          author: {connect: {id: realm.authorId}},
          title: realm.title,
          representsRealm: {
            connect: {
              id: realm.id
            }
          }
        }
      });

      return realm;
    });
  }

  async updateRealm(args: Prisma.RealmUpdateArgs): Promise<Realm> {
    return this.prisma.$transaction(async (prisma) => {
      const realm = await prisma.realm.update(args);

      if (args.data.title) {
        const newTitle =
          typeof args.data.title === "string"
            ? args.data.title
            : args.data.title.set;

        if (newTitle) {
          const baseSlug = this.slugService.slugify(newTitle);

          await prisma.realm.update({
            where: {
              id: realm.id
            },
            data: {
              baseSlug
            }
          });

          await this.loreService.updateLore({
            where: {
              id: realm.representationLoreId as string
            },
            data: {
              title: newTitle
            }
          });
        }
      }

      return realm;
    });
  }

  async deleteRealm(args: Prisma.RealmDeleteArgs): Promise<Realm> {
    return this.prisma.realm.delete(args);
  }
}
