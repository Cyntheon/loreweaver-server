import {Injectable} from "@nestjs/common";
import {
  Collection,
  Prisma,
  Shortcode,
  ShortcodeType,
  User
} from "@prisma/client";
import {GraphQLError} from "graphql/error";
import {GenericSlug, Override, PickPartial} from "../@types";
import {PrismaService} from "../prisma";
import {ShortcodeService} from "../shortcode";
import {SlugService} from "../slug";
import {UserService} from "../user";

type CollectionCreateArgs = Override<
  Prisma.CollectionCreateArgs,
  {
    data: PickPartial<
      Prisma.CollectionCreateInput,
      "baseSlug" | "slugDiscriminator" | "followTarget"
    >;
  }
>;

@Injectable()
export class CollectionService {
  constructor(
    private prisma: PrismaService,
    private slugService: SlugService,
    private shortcodeService: ShortcodeService,
    private userService: UserService
  ) {}

  async getCollection(
    args: Prisma.CollectionFindUniqueArgs
  ): Promise<Collection | null> {
    return this.prisma.collection.findUnique(args);
  }

  calculateCollectionSlug(args: GenericSlug): string {
    return this.slugService.appendDiscriminatorToSlug(args);
  }

  async getCollectionUrl(
    where: Prisma.CollectionWhereUniqueInput
  ): Promise<string> {
    const collection = (await this.getCollection({
      where,
      select: {
        author: true,
        baseSlug: true,
        slugDiscriminator: true
      }
    })) as {author: User} & Collection;

    if (!collection) {
      throw new GraphQLError("Collection not found", {
        extensions: {code: "NOT_FOUND"}
      });
    }

    const authorSlug = this.userService.calculateUserSlug(collection.author);
    const collectionSlug = this.calculateCollectionSlug(collection);

    return `/${authorSlug}/c/${collectionSlug}`;
  }

  async getOrGenerateCollectionShortcode(
    where: Prisma.ShortcodeWhereUniqueInput
  ): Promise<Shortcode> {
    return this.prisma.$transaction(async (prisma) => {
      const collection = (await this.getCollection({
        where,
        select: {
          shortcode: true
        }
      })) as ({shortcode: Shortcode} & Collection) | null;

      if (!collection) {
        throw new GraphQLError("Collection not found", {
          extensions: {code: "NOT_FOUND"}
        });
      }

      if (collection.shortcode) {
        return collection.shortcode;
      }

      return this.shortcodeService.createShortcode({
        data: {
          type: ShortcodeType.Collection,
          collection: {
            connect: where
          }
        }
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
    const collectionsWithSameBaseSlug = await this.getManyCollections({
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
      collectionsWithSameBaseSlug,
      {preSorted: true}
    );
  }

  async getManyCollections(
    args: Prisma.CollectionFindManyArgs
  ): Promise<Collection[]> {
    return this.prisma.collection.findMany(args);
  }

  async createCollection(args: CollectionCreateArgs): Promise<Collection> {
    return this.prisma.$transaction(async (prisma) => {
      const baseSlug = this.slugService.slugify(args.data.title);
    });
  }

  async updateCollection(
    args: Prisma.CollectionUpdateArgs
  ): Promise<Collection> {
    return this.prisma.collection.update(args);
  }

  async updateManyCollections(
    args: Prisma.CollectionUpdateManyArgs
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.collection.updateMany(args);
  }

  async deleteCollection(
    args: Prisma.CollectionDeleteArgs
  ): Promise<Collection> {
    return this.prisma.collection.delete(args);
  }

  async deleteManyCollections(
    args: Prisma.CollectionDeleteManyArgs
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.collection.deleteMany(args);
  }
}
