import {ContentType, FollowTargetType, ShortcodeType} from "@generated/prisma";
import {Injectable} from "@nestjs/common";
import {Prisma, Realm} from "@prisma/client";
import {GraphQLError} from "graphql/error";
import {PrismaService} from "../prisma/prisma.service";
import {ShortcodeService} from "../shortcode/shortcode.service";
import {SlugService} from "../slug/slug.service";

type RealmCreateArgs = Omit<Prisma.RealmCreateArgs, "data"> & {
  data: Prisma.RealmCreateInput;
};

@Injectable()
export class RealmService {
  constructor(
    private prisma: PrismaService,
    private slugService: SlugService,
    private shortcodeService: ShortcodeService
  ) {}

  async getRealm(args: Prisma.RealmFindUniqueArgs): Promise<Realm | null> {
    return this.prisma.realm.findUnique(args);
  }

  async getRealmUrl(where: Prisma.RealmWhereUniqueInput): Promise<string> {
    const realm = await this.prisma.realm.findUnique({
      where,
      select: {
        author: true,
        slug: true
      }
    });

    if (!realm) {
      throw new GraphQLError("Realm not found", {
        extensions: {code: "NOT_FOUND"}
      });
    }

    return `/@${realm.author.username}/r/${realm.slug}`;
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

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.shortcodeService.getShortcodeUrl({
        id: updatedRealm.shortcodeId!
      });
    });
  }

  async getRealms(args: Prisma.RealmFindManyArgs): Promise<Realm[]> {
    return this.prisma.realm.findMany(args);
  }

  async createRealm(args: RealmCreateArgs): Promise<Realm> {
    const slug = this.slugService.slugify(args.data.title);

    return this.prisma.$transaction(async (prisma) => {
      const realm = await prisma.realm.create({
        ...args,
        data: {
          ...args.data,
          slug,
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
          representationLore: {
            create: {
              realm: {connect: {id: realm.id}},
              author: {connect: {id: realm.authorId}},
              title: realm.title,
              slug: realm.slug,
              content: {
                create: {type: ContentType.Lore}
              },
              contents: "{}"
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
          const slug = this.slugService.slugify(newTitle);

          await prisma.realm.update({
            where: {id: realm.id},
            data: {
              slug
            }
          });

          await prisma.lore.update({
            where: {id: realm.representationLoreId as string},
            data: {
              title: newTitle,
              slug
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
