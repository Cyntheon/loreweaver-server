import {ShortcodeType} from "@generated/prisma";
import {RealmSlug} from "@generated/realm-slug";
import {Injectable} from "@nestjs/common";
import {Prisma, Realm, User} from "@prisma/client";
import {GraphQLError} from "graphql/error";
import {PrismaService} from "../prisma/prisma.service";
import {ShortcodeService} from "../shortcode/shortcode.service";
import {RealmSlugService} from "./realm-slug.service";
import {RealmService} from "./realm.service";

@Injectable()
export class RealmUrlService {
  constructor(
    private prisma: PrismaService,
    private shortcodeService: ShortcodeService,
    private realmService: RealmService,
    private realmSlugService: RealmSlugService
  ) {}

  async getRealmUrl(where: Prisma.RealmWhereUniqueInput): Promise<string> {
    const realm = (await this.prisma.realm.findUnique({
      where,
      select: {
        author: true,
        slug: true
      }
    })) as {author: User; slug: RealmSlug} & Realm;

    if (!realm) {
      throw new GraphQLError("Realm not found", {
        extensions: {code: "NOT_FOUND"}
      });
    }

    // const userSlug = this.userService.calculateUserSlug(realm.author);
    const userSlug = "TODO";
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
}
