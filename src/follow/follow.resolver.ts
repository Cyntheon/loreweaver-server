import {
  CreateManyFollowArgs,
  CreateOneFollowArgs,
  FindManyFollowArgs,
  FindUniqueFollowArgs,
  Follow,
  UpdateManyFollowArgs,
  UpdateOneFollowArgs
} from "@generated/follow";
import {FollowTarget} from "@generated/follow-target";
import {AffectedRows} from "@generated/prisma";
import {User} from "@generated/user";
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver
} from "@nestjs/graphql";
import {FollowTargetService} from "../follow-target/follow-target.service";
import {UserService} from "../user/user.service";
import {FollowService} from "./follow.service";

@Resolver(() => Follow)
export class FollowResolver {
  constructor(
    private followService: FollowService,
    private userService: UserService,
    private followTargetService: FollowTargetService
  ) {}

  @Query(() => Follow, {name: "follow", nullable: true})
  async getFollow(@Args() args: FindUniqueFollowArgs): Promise<Follow | null> {
    return this.followService.getFollow(args);
  }

  @Query(() => [Follow], {name: "follows", nullable: false})
  async getFollows(@Args() args: FindManyFollowArgs): Promise<Follow[]> {
    return this.followService.getManyFollows(args);
  }

  @Mutation(() => Follow, {nullable: false})
  async createFollow(@Args() args: CreateOneFollowArgs): Promise<Follow> {
    // @ts-ignore
    return this.followService.createFollow(args);
  }

  @Mutation(() => AffectedRows, {nullable: false})
  async createManyFollows(args: CreateManyFollowArgs): Promise<AffectedRows> {
    return this.followService.createManyFollows(args);
  }

  @Mutation(() => Follow, {nullable: false})
  async updateFollow(@Args() args: UpdateOneFollowArgs): Promise<Follow> {
    // @ts-ignore
    return this.followService.updateFollow(args);
  }

  @Mutation(() => AffectedRows, {nullable: false})
  async updateManyFollows(args: UpdateManyFollowArgs): Promise<AffectedRows> {
    return this.followService.updateManyFollows(args);
  }

  @Mutation(() => Follow, {nullable: false})
  async deleteFollow(@Args() args: FindUniqueFollowArgs): Promise<Follow> {
    return this.followService.deleteFollow(args);
  }

  @Mutation(() => AffectedRows, {nullable: false})
  async deleteManyFollows(args: FindManyFollowArgs): Promise<AffectedRows> {
    return this.followService.deleteManyFollows(args);
  }

  @ResolveField(() => User, {name: "user", nullable: false})
  async getUser(@Parent() follow: Follow): Promise<User> {
    return (await this.userService.getUser({
      where: {id: follow.userId}
    })) as User;
  }

  @ResolveField(() => FollowTarget, {name: "followTarget", nullable: false})
  async getFollowTarget(@Parent() follow: Follow): Promise<FollowTarget> {
    return (await this.followTargetService.getFollowTarget({
      where: {id: follow.followTargetId}
    })) as FollowTarget;
  }
}
