import {UserAuthType} from "@generated/prisma";
import {Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {Prisma, User, UserAuth} from "@prisma/client";
import {PrismaService} from "../prisma/prisma.service";
import {
  LoginCredentialsEmailPassword,
  LoginCredentialsUsernamePassword
} from "./@types";
import {ArgonService} from "./argon.service";
import {LoginResponse} from "./output/login-response.output";
import {RefreshResponse} from "./output/refresh-response.output";

@Injectable()
export class UserAuthService {
  constructor(
    private prisma: PrismaService,
    private argon: ArgonService,
    private jwtService: JwtService
  ) {}

  async getUserAuth(
    args: Prisma.UserAuthFindUniqueArgs
  ): Promise<UserAuth | null> {
    return this.prisma.userAuth.findUnique(args);
  }

  async getUserAuths(args: Prisma.UserAuthFindManyArgs): Promise<UserAuth[]> {
    return this.prisma.userAuth.findMany(args);
  }

  async createUserAuth(args: Prisma.UserAuthCreateArgs): Promise<UserAuth> {
    return this.prisma.userAuth.create(args);
  }

  async updateUserAuth(args: Prisma.UserAuthUpdateArgs): Promise<UserAuth> {
    return this.prisma.userAuth.update(args);
  }

  async deleteUserAuth(args: Prisma.UserAuthDeleteArgs): Promise<UserAuth> {
    return this.prisma.userAuth.delete(args);
  }

  async validateUserUsernamePassword(
    credentials: LoginCredentialsUsernamePassword
  ): Promise<User | null> {
    const auth = await this.prisma.userAuth.findFirst({
      where: {
        type: UserAuthType.UsernamePassword,
        data: {path: ["username"], equals: credentials.username}
      },
      include: {user: true}
    });

    if (!auth) {
      return null;
    }

    const {passwordHash} = auth.data as Prisma.JsonObject;

    if (await this.argon.verify(passwordHash as string, credentials.password)) {
      return auth.user;
    }

    return null;
  }

  async validateUserEmailPassword(
    credentials: LoginCredentialsEmailPassword
  ): Promise<User | null> {
    const auth = await this.prisma.userAuth.findFirst({
      where: {
        type: UserAuthType.EmailPassword,
        data: {path: ["email"], equals: credentials.email}
      },
      include: {user: true}
    });

    if (!auth) {
      return null;
    }

    const {passwordHash} = auth.data as Prisma.JsonObject;

    if (await this.argon.verify(passwordHash as string, credentials.password)) {
      return auth.user;
    }

    return null;
  }

  async login(user: User): Promise<LoginResponse> {
    const accessToken = await this.jwtService.signAsync({
      username: user.username,
      sub: user.id
    });

    const refreshToken = await this.jwtService.signAsync(
      {
        username: user.username,
        sub: user.id
      },
      {
        expiresIn: "14d",
        secret: process.env.JWT_REFRESH_SECRET
      }
    );

    return {
      accessToken,
      refreshToken,
      user
    };
  }

  async refresh(refreshToken: string): Promise<RefreshResponse> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const {username, sub: id} = await this.jwtService.verifyAsync(
      refreshToken,
      {
        secret: process.env.JWT_REFRESH_SECRET,
        ignoreExpiration: false
      }
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return this.login({username, id} as User);
  }
}
