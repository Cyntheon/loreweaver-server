import {ContentTarget} from "@generated/content-target";
import {Injectable} from "@nestjs/common";
import {Prisma} from "@prisma/client";
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class ContentTargetService {
  constructor(private prisma: PrismaService) {}

  async getContentTarget(
    args: Prisma.ContentTargetFindUniqueArgs
  ): Promise<ContentTarget | null> {
    return this.prisma.contentTarget.findUnique(args);
  }

  async createContentTarget(
    args: Prisma.ContentTargetCreateArgs
  ): Promise<ContentTarget> {
    return this.prisma.contentTarget.create(args);
  }

  async updateContentTarget(
    args: Prisma.ContentTargetUpdateArgs
  ): Promise<ContentTarget> {
    return this.prisma.contentTarget.update(args);
  }

  async deleteContentTarget(
    args: Prisma.ContentTargetDeleteArgs
  ): Promise<ContentTarget> {
    return this.prisma.contentTarget.delete(args);
  }
}
