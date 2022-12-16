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
import {unpackStringFromSetObject} from "../util/unpack-string-from-set-object";
import {RealmSlugService} from "./realm-slug.service";
import {RepresentationLoreService} from "./representation-lore.service";

type RealmCreateArgs = Override<
  Prisma.RealmCreateArgs,
  {
    data: PickPartial<Prisma.RealmCreateInput, "slug" | "followTarget">;
  }
>;

@Injectable()
export class RealmService {
  constructor(
    private prisma: PrismaService,
    private slugService: SlugService,
    private shortcodeService: ShortcodeService,
    private followTargetService: FollowTargetService,
    private realmSlugService: RealmSlugService,
    private representationLoreService: RepresentationLoreService,
    private userService: UserService,
    private loreService: LoreService
  ) {}

  async getRealm(args: Prisma.RealmFindUniqueArgs): Promise<Realm | null> {
    return this.prisma.realm.findUnique(args);
  }

  async getManyRealms(args: Prisma.RealmFindManyArgs): Promise<Realm[]> {
    return this.prisma.realm.findMany(args);
  }

  async createRealm(args: RealmCreateArgs): Promise<Realm> {
    return this.prisma.$transaction(async (prisma) => {
      const baseSlug = this.slugService.slugify(args.data.title);

      const followTarget = await this.followTargetService.createFollowTarget({
        data: {
          type: FollowTargetType.Realm
        }
      });

      const slug = await this.realmSlugService.createRealmSlug({
        data: {
          author: args.data.author,
          baseSlug: this.slugService.slugify(args.data.title)
        }
      });

      const representationLore =
        await this.representationLoreService.createRepresentationLore({
          data: {}
        });

      const realm = await prisma.realm.create({
        ...args,
        data: {
          ...args.data,
          followTarget: {connect: {id: followTarget.id}},
          slug: {connect: {id: slug.id}},
          representationLore: {connect: {id: representationLore.id}}
        }
      });

      await this.loreService.createLore({
        data: {
          realm: {
            connect: {
              id: realm.id
            }
          },
          author: {
            connect: {
              id: realm.authorId
            }
          },
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

      const newTitle = unpackStringFromSetObject(
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
