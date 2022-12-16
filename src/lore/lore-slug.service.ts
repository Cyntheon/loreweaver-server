import {LoreSlug} from "@generated/lore-slug";
import {Injectable} from "@nestjs/common";
import {Prisma} from "@prisma/client";
import {GenericSlug, Override, PickPartial} from "../@types";
import {PrismaService} from "../prisma/prisma.service";
import {SlugService} from "../slug/slug.service";

type LoreSlugCreateArgs = Override<
  Prisma.LoreSlugCreateArgs,
  {
    data: PickPartial<Prisma.LoreSlugCreateInput, "discriminator">;
  }
>;

@Injectable()
export class LoreSlugService {
  constructor(
    private prisma: PrismaService,
    private slugService: SlugService
  ) {}

  async getLoreSlug(
    args: Prisma.LoreSlugFindUniqueArgs
  ): Promise<LoreSlug | null> {
    return this.prisma.loreSlug.findUnique(args);
  }

  async getManyLoreSlugs(
    args: Prisma.LoreSlugFindManyArgs
  ): Promise<LoreSlug[]> {
    return this.prisma.loreSlug.findMany(args);
  }

  async createLoreSlug(args: LoreSlugCreateArgs): Promise<LoreSlug> {
    const slugsWithSameBaseSlug = (await this.getManyLoreSlugs({
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

    return this.prisma.loreSlug.create({
      ...args,
      data: {
        ...args.data,
        discriminator
      }
    });
  }

  async updateLoreSlug(args: Prisma.LoreSlugUpdateArgs): Promise<LoreSlug> {
    return this.prisma.loreSlug.update(args);
  }

  async deleteLoreSlug(args: Prisma.LoreSlugDeleteArgs): Promise<LoreSlug> {
    return this.prisma.loreSlug.delete(args);
  }

  calculateLoreSlugText(args: GenericSlug): string {
    return this.slugService.appendDiscriminatorToSlug(args);
  }
}
