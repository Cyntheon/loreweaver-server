import {Injectable} from "@nestjs/common";
import {Prisma} from "@prisma/client";
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class UserProfileService {
  constructor(private prisma: PrismaService) {}

  public async getUserProfile(args: Prisma.UserProfileFindUniqueArgs) {
    return this.prisma.userProfile.findUnique(args);
  }

  public async updateUserProfile(args: Prisma.UserProfileUpdateArgs) {
    return this.prisma.userProfile.update(args);
  }
}
