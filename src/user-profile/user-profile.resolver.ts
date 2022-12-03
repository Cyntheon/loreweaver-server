import {
  FindUniqueUserProfileArgs,
  UpdateOneUserProfileArgs,
  User
} from "@generated/user";
import {UserProfile} from "@generated/user-profile";
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver
} from "@nestjs/graphql";
import {UserService} from "../user/user.service";
import {UserProfileService} from "./user-profile.service";

@Resolver(() => UserProfile)
export class UserProfileResolver {
  constructor(
    private userProfileService: UserProfileService,
    private userService: UserService
  ) {}

  @Query(() => UserProfile, {name: "userProfile", nullable: true})
  async getUserProfile(
    @Args() args: FindUniqueUserProfileArgs
  ): Promise<UserProfile | null> {
    return this.userProfileService.getUserProfile(args);
  }

  @Mutation(() => UserProfile, {nullable: false})
  async updateUserProfile(
    @Args() args: UpdateOneUserProfileArgs
  ): Promise<UserProfile> {
    // @ts-ignore
    return this.userProfileService.updateUserProfile(args);
  }

  @ResolveField(() => User, {name: "user", nullable: false})
  async getUser(@Parent() userProfile: UserProfile): Promise<User> {
    return (await this.userService.getUser({
      where: {id: userProfile.userId}
    })) as User;
  }
}
