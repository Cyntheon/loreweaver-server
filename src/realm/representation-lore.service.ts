import {Injectable} from "@nestjs/common";
import {Prisma, RepresentationLore} from "@prisma/client";
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class RepresentationLoreService {
  constructor(private prisma: PrismaService) {}

  async getRepresentationLore(
    args: Prisma.RepresentationLoreFindUniqueArgs
  ): Promise<RepresentationLore | null> {
    return this.prisma.representationLore.findUnique(args);
  }

  async getManyRepresentationLores(
    args: Prisma.RepresentationLoreFindManyArgs
  ): Promise<RepresentationLore[]> {
    return this.prisma.representationLore.findMany(args);
  }

  async createRepresentationLore(
    args: Prisma.RepresentationLoreCreateArgs
  ): Promise<RepresentationLore> {
    return this.prisma.representationLore.create(args);
  }

  async updateRepresentationLore(
    args: Prisma.RepresentationLoreUpdateArgs
  ): Promise<RepresentationLore> {
    return this.prisma.representationLore.update(args);
  }

  async deleteRepresentationLore(
    args: Prisma.RepresentationLoreDeleteArgs
  ): Promise<RepresentationLore> {
    return this.prisma.representationLore.delete(args);
  }
}
