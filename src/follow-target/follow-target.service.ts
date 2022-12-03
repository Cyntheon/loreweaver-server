import {Injectable} from "@nestjs/common";
import {Prisma, FollowTarget} from "@prisma/client";
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class FollowTargetService {
  constructor(private prisma: PrismaService) {}

  async getFollowTarget(
    args: Prisma.FollowTargetFindUniqueArgs
  ): Promise<FollowTarget | null> {
    return this.prisma.followTarget.findUnique(args);
  }

  async createFollowTarget(
    args: Prisma.FollowTargetCreateArgs
  ): Promise<FollowTarget> {
    return this.prisma.followTarget.create(args);
  }

  async updateFollowTarget(
    args: Prisma.FollowTargetUpdateArgs
  ): Promise<FollowTarget> {
    return this.prisma.followTarget.update(args);
  }

  async deleteFollowTarget(
    args: Prisma.FollowTargetDeleteArgs
  ): Promise<FollowTarget> {
    return this.prisma.followTarget.delete(args);
  }
}
