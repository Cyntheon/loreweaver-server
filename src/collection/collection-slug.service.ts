import {Injectable} from "@nestjs/common";
import {Prisma} from "@prisma/client";
import {
  Override,
  PickPartial,
  PrismaCreateArgs,
  PrismaCreateInput
} from "../@types";
import {PrismaService, PrismaUtilsService} from "../prisma";
import {SlugService} from "../slug";
import {DiscriminatorService} from "../slug/discriminator.service";

type CollectionSlugCreateArgs = PrismaCreateArgs<
  Prisma.CollectionSlugCreateArgs,
  Prisma.CollectionSlugCreateInput,
  "discriminator"
>;

type CollectionSlugUpdateArgs = Override<
  Prisma.CollectionSlugUpdateArgs,
  {data: PickPartial<Prisma.CollectionSlugUpdateInput, "discriminator">}
>;

@Injectable()
export class CollectionSlugService {
  constructor(
    private prisma: PrismaService,
    private prismaUtilsService: PrismaUtilsService,
    private slugService: SlugService,
    private discriminatorService: DiscriminatorService
  ) {}

  async getCollectionSlug(args: Prisma.CollectionSlugFindUniqueArgs) {
    return this.prisma.collectionSlug.findUnique(args);
  }

  async getManyCollectionSlugs(args: Prisma.CollectionSlugFindManyArgs) {
    return this.prisma.collectionSlug.findMany(args);
  }

  async createCollectionSlug(args: CollectionSlugCreateArgs) {
    if (!args.data.author.connect) {
      throw new Error(
        "args.data.author.connect is required to create a new collection slug"
      );
    }

    const slugsWithSameBaseSlug = (await this.getManyCollectionSlugs({
      where: {
        baseSlug: args.data.baseSlug,
        author: args.data.author.connect
      },
      select: {
        discriminator: true
      },
      orderBy: {
        discriminator: "asc"
      }
    })) as {discriminator: number}[];

    const discriminator =
      this.discriminatorService.findLowestAvailableDiscriminator(
        slugsWithSameBaseSlug,
        {preSorted: true}
      );

    const argsWithId = this.prismaUtilsService.injectIdIntoArgs<
      PrismaCreateInput<Prisma.CollectionSlugCreateInput>,
      PrismaCreateArgs<
        Prisma.CollectionSlugCreateArgs,
        Prisma.CollectionSlugCreateInput
      >
    >({
      ...args,
      data: {
        ...args.data,
        discriminator
      }
    });

    return this.prisma.collectionSlug.create(argsWithId);
  }

  async updateCollectionSlug(args: CollectionSlugUpdateArgs) {
    const collectionSlug = await this.getCollectionSlug({where: args.where});

    if (!collectionSlug) {
      throw new Error("Collection slug not found");
    }

    const baseSlugIsChanging =
      args.data.baseSlug &&
      this.prismaUtilsService.unpackStringFromSetObject(args.data.baseSlug) !==
        collectionSlug.baseSlug;

    if (!baseSlugIsChanging) {
      return this.prisma.collectionSlug.update(args);
    }

    const slugsWithSameBaseSlug = (await this.getManyCollectionSlugs({
      where: {
        id: {
          not: collectionSlug.id
        },
        baseSlug: this.prismaUtilsService.unpackStringFromSetObject(
          args.data.baseSlug
        ),
        authorId: collectionSlug.authorId
      },
      select: {
        discriminator: true
      },
      orderBy: {
        discriminator: "asc"
      }
    })) as {discriminator: number}[];

    const discriminator =
      this.discriminatorService.findLowestAvailableDiscriminator(
        slugsWithSameBaseSlug,
        {preSorted: true}
      );

    const argsWithDiscriminator: Prisma.CollectionSlugUpdateArgs = {
      ...args,
      data: {
        ...args.data,
        discriminator
      }
    };

    return this.prisma.collectionSlug.update(argsWithDiscriminator);
  }

  async deleteCollectionSlug(args: Prisma.CollectionSlugDeleteArgs) {
    return this.prisma.collectionSlug.delete(args);
  }
}
