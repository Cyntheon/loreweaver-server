import {Lore} from "@generated/lore";
import {Realm} from "@generated/realm";
import {
  FindManyUserArgs,
  FindUniqueUserArgs,
  UpdateOneUserArgs,
  User
} from "@generated/user";
import {UserProfile} from "@generated/user-profile";
import {UseGuards} from "@nestjs/common";
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver
} from "@nestjs/graphql";
import {LoreService} from "../lore/lore.service";
import {RealmService} from "../realm/realm.service";
import {CurrentUser} from "../user-auth/decorator/current-user.decorator";
import {JwtAuthGuard} from "../user-auth/guard/jwt-auth.guard";
import {UserProfileService} from "../user-profile/user-profile.service";
import {UserSelfGuard} from "./guard/user-self.guard";
import {CreateOneUserArgs} from "./input/create-one-user.args";
import {UserService} from "./user.service";

@Resolver(() => User)
export class UserResolver {
  constructor(
    private userService: UserService,
    private userProfileService: UserProfileService,
    private realmService: RealmService,
    private loreService: LoreService
  ) {}

  @Query(() => User, {name: "user", nullable: true})
  async getUser(@Args() args: FindUniqueUserArgs): Promise<User | null> {
    return this.userService.getUser(args);
  }

  @Query(() => User, {name: "me", nullable: true})
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@CurrentUser() user: User): Promise<User | null> {
    return this.userService.getUser({where: {id: user.id}});
  }

  @Query(() => [User], {name: "users", nullable: false})
  async getManyUsers(@Args() args: FindManyUserArgs): Promise<User[]> {
    return this.userService.getManyUsers(args);
  }

  @Query(() => Boolean, {name: "usernameTaken", nullable: false})
  async getIsUsernameTaken(
    @Args("username") username: string
  ): Promise<boolean> {
    return this.userService.getIsUsernameTaken(username);
  }

  @Mutation(() => User, {nullable: false})
  async createUser(@Args() args: CreateOneUserArgs): Promise<User> {
    return this.userService.createUser(args);
  }

  @Mutation(() => User, {nullable: false})
  @UseGuards(JwtAuthGuard, UserSelfGuard)
  async updateUser(@Args() args: UpdateOneUserArgs): Promise<User> {
    // @ts-ignore
    return this.userService.updateUser(args);
  }

  @Mutation(() => User, {nullable: false})
  @UseGuards(JwtAuthGuard, UserSelfGuard)
  async deleteUser(@Args() args: FindUniqueUserArgs): Promise<User> {
    return this.userService.deleteUser(args);
  }

  @ResolveField(() => UserProfile, {name: "profile", nullable: false})
  async getUserProfile(@Parent() user: User): Promise<UserProfile> {
    return (await this.userProfileService.getUserProfile({
      where: {userId: user.id}
    })) as UserProfile;
  }

  @ResolveField(() => [Realm], {name: "realms", nullable: false})
  async getAuthoredRealms(@Parent() author: User): Promise<Realm[]> {
    return this.realmService.getManyRealms({where: {authorId: author.id}});
  }

  @ResolveField(() => [Lore], {name: "lores", nullable: false})
  async getAuthoredLores(@Parent() author: User): Promise<Lore[]> {
    return this.loreService.getManyLores({where: {authorId: author.id}});
  }
}
