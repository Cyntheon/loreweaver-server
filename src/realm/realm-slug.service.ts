import {Injectable} from "@nestjs/common";
import {Prisma, RealmSlug} from "@prisma/client";
import {GenericSlug, Override, PickPartial} from "../@types";
import {PrismaService} from "../prisma/prisma.service";
import {SlugService} from "../slug/slug.service";

type RealmSlugCreateArgs = Override<
  Prisma.RealmSlugCreateArgs,
  {
    data: PickPartial<Prisma.RealmSlugCreateInput, "discriminator">;
  }
>;

@Injectable()
export class RealmSlugService {
  constructor(
    private prisma: PrismaService,
    private slugService: SlugService
  ) {}

  async getRealmSlug(
    args: Prisma.RealmSlugFindUniqueArgs
  ): Promise<RealmSlug | null> {
    return this.prisma.realmSlug.findUnique(args);
  }

  async getManyRealmSlugs(
    args: Prisma.RealmSlugFindManyArgs
  ): Promise<RealmSlug[]> {
    return this.prisma.realmSlug.findMany(args);
  }

  async createRealmSlug(args: RealmSlugCreateArgs): Promise<RealmSlug> {
    const slugsWithSameBaseSlug = (await this.getManyRealmSlugs({
      where: {
        baseSlug: args.data.baseSlug
      },
      select: {
        discriminator: true
      },
      orderBy: {
        discriminator: "asc"
      }
    })) as {discriminator: number}[];

    const discriminator = this.slugService.findLowestAvailableDiscriminator(
      slugsWithSameBaseSlug,
      {preSorted: true}
    );

    return this.prisma.realmSlug.create({
      ...args,
      data: {
        ...args.data,
        discriminator
      }
    });
  }

  async updateRealmSlug(args: Prisma.RealmSlugUpdateArgs): Promise<RealmSlug> {
    return this.prisma.realmSlug.update(args);
  }

  async deleteRealmSlug(args: Prisma.RealmSlugDeleteArgs): Promise<RealmSlug> {
    return this.prisma.realmSlug.delete(args);
  }

  calculateRealmSlugText(args: GenericSlug): string {
    return this.slugService.appendDiscriminatorToSlug(args);
  }
}
