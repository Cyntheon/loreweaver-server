import {Follow} from "@generated/follow";
import {Injectable} from "@nestjs/common";
import {Prisma} from "@prisma/client";
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class FollowService {
  constructor(private prisma: PrismaService) {}

  async getFollow(args: Prisma.FollowFindUniqueArgs): Promise<Follow | null> {
    return this.prisma.follow.findUnique(args);
  }

  async getManyFollows(args: Prisma.FollowFindManyArgs): Promise<Follow[]> {
    return this.prisma.follow.findMany(args);
  }

  async createFollow(args: Prisma.FollowCreateArgs): Promise<Follow> {
    return this.prisma.follow.create(args);
  }

  async createManyFollows(
    args: Prisma.FollowCreateManyArgs
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.follow.createMany(args);
  }

  async updateFollow(args: Prisma.FollowUpdateArgs): Promise<Follow> {
    return this.prisma.follow.update(args);
  }

  async updateManyFollows(
    args: Prisma.FollowUpdateManyArgs
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.follow.updateMany(args);
  }

  async deleteFollow(args: Prisma.FollowDeleteArgs): Promise<Follow> {
    return this.prisma.follow.delete(args);
  }

  async deleteManyFollows(
    args: Prisma.FollowDeleteManyArgs
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.follow.deleteMany(args);
  }
}
