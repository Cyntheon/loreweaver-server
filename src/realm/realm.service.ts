import {FollowTargetType, ShortcodeType} from "@generated/prisma";
import {Injectable} from "@nestjs/common";
import {Prisma, Realm, User} from "@prisma/client";
import {GraphQLError} from "graphql/error";
import {Override, PickPartial} from "../@types";
import {FollowTargetService} from "../follow-target/follow-target.service";
import {LoreService} from "../lore/lore.service";
import {PrismaService} from "../prisma/prisma.service";
import {ShortcodeService} from "../shortcode/shortcode.service";
import {SlugService} from "../slug/slug.service";
import {UserService} from "../user/user.service";
import {stringOrSetObjectToString} from "../util/stringOrSetObjectToString";

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
    private followTargetService: FollowTargetService,
    private userService: UserService,
    private loreService: LoreService
  ) {}

  async getRealm(args: Prisma.RealmFindUniqueArgs): Promise<Realm | null> {
    return this.prisma.realm.findUnique(args);
  }

  calculateRealmSlug(args: {
    baseSlug: string;
    slugDiscriminator: number;
  }): string {
    return this.slugService.calculateSlug(args);
  }

  async getRealmUrl(where: Prisma.RealmWhereUniqueInput): Promise<string> {
    const realm = (await this.prisma.realm.findUnique({
      where,
      select: {
        author: true,
        baseSlug: true,
        slugDiscriminator: true
      }
    })) as {author: User} & Realm;

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
    const realmsWithSameBaseSlug = await this.getManyRealms({
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

  async getManyRealms(args: Prisma.RealmFindManyArgs): Promise<Realm[]> {
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
          slugDiscriminator:
        }
      });

      await this.followTargetService.createFollowTarget({
        data: {
          type: FollowTargetType.Realm,
          realm: {
            connect: {
              id: realm.id
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
      const realm = await prisma.realm.findUnique({
        where: args.where
      });

      if (!realm) {
        throw new GraphQLError("Realm not found", {
          extensions: {code: "NOT_FOUND"}
        });
      }

      const newTitle = stringOrSetObjectToString(
        args.data.title as string | {set: string}
      );
      const newSlug = this.slugService.slugify(newTitle);
      const isSlugChanging = args.data.title && newSlug !== realm.baseSlug;
      const getSlugDiscriminator = async () =>
        this.findLowestAvailableDiscriminator({
          ignoreId: realm.id,
          baseSlug: newSlug,
          authorId: realm.authorId
        });

      if (isSlugChanging && realm.representationLoreId) {
        await this.loreService.updateLore({
          where: {
            id: realm.representationLoreId
          },
          data: {
            title: newTitle
          }
        });
      }

      return prisma.realm.update({
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

  async deleteRealm(args: Prisma.RealmDeleteArgs): Promise<Realm> {
    return this.prisma.realm.delete(args);
  }
}
