import {FollowTargetType, UserAuthType} from "@generated/prisma";
import {Injectable} from "@nestjs/common";
import {Prisma, User} from "@prisma/client";
import {PrismaService} from "../prisma/prisma.service";
import {ArgonService} from "../user-auth/argon.service";
import {CreateOneUserArgs} from "./input/create-one-user.args";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private argon: ArgonService) {}

  async getUser(args: Prisma.UserFindUniqueArgs): Promise<User | null> {
    return this.prisma.user.findUnique(args);
  }

  calculateUserSlug(args: {username: string}): string {
    return `@${args.username}`;
  }

  async getUserUrl(where: Prisma.UserWhereUniqueInput): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where,
      select: {
        username: true
      }
    });

    if (!user) {
      throw new Error("User not found");
    }

    return `/${this.calculateUserSlug(user)}`;
  }

  async getUserId(where: Prisma.UserWhereUniqueInput): Promise<string | null> {
    return where.id || (await this.getUser({where}))?.id || null;
  }

  async getManyUsers(args: Prisma.UserFindManyArgs): Promise<User[]> {
    return this.prisma.user.findMany(args);
  }

  async getIsUsernameTaken(username: string): Promise<boolean> {
    return !!(await this.prisma.user.findUnique({
      where: {username}
    }));
  }

  async createUser({data}: CreateOneUserArgs): Promise<User> {
    const passwordHash = await this.argon.hash(
      data.password,
      data.username + data.email
    );

    const {password, email, ...userData} = data;

    // @ts-ignore
    return this.prisma.user.create({
      // @ts-ignore
      data: {
        ...userData,
        authData: {
          createMany: {
            data: [
              {
                type: UserAuthType.UsernamePassword,
                data: {
                  username: data.username,
                  passwordHash
                }
              },
              {
                type: UserAuthType.EmailPassword,
                data: {
                  email: data.email,
                  passwordHash
                }
              }
            ]
          }
        },
        profile: {create: {}},
        followTarget: {create: {type: FollowTargetType.User}}
      }
    });
  }

  async updateUser(args: Prisma.UserUpdateArgs): Promise<User> {
    return this.prisma.user.update(args);
  }

  async deleteUser(args: Prisma.UserDeleteArgs): Promise<User> {
    return this.prisma.user.delete(args);
  }
}
