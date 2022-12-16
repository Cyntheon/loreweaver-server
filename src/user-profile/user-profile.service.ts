import {Injectable} from "@nestjs/common";
import {Prisma, UserProfile} from "@prisma/client";
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class UserProfileService {
  constructor(private prisma: PrismaService) {}

  async getUserProfile(
    args: Prisma.UserProfileFindUniqueArgs
  ): Promise<UserProfile | null> {
    return this.prisma.userProfile.findUnique(args);
  }

  async createUserProfile(
    args: Prisma.UserProfileCreateArgs
  ): Promise<UserProfile> {
    return this.prisma.userProfile.create(args);
  }

  async updateUserProfile(
    args: Prisma.UserProfileUpdateArgs
  ): Promise<UserProfile> {
    return this.prisma.userProfile.update(args);
  }

  async deleteUserProfile(
    args: Prisma.UserProfileDeleteArgs
  ): Promise<UserProfile> {
    return this.prisma.userProfile.delete(args);
  }
}
