import {
  CreateOneLoreArgs,
  DeleteOneLoreArgs,
  FindManyLoreArgs,
  FindUniqueLoreArgs,
  Lore,
  UpdateOneLoreArgs
} from "@generated/lore";
import {Realm} from "@generated/realm";
import {User} from "@generated/user";
import {
  Args,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Root
} from "@nestjs/graphql";
import {RealmService} from "../realm/realm.service";
import {SlugService} from "../slug/slug.service";
import {UserService} from "../user/user.service";
import {LoreService} from "./lore.service";

@Resolver(() => Lore)
export class LoreResolver {
  constructor(
    private loreService: LoreService,
    private userService: UserService,
    private realmService: RealmService,
    private slugService: SlugService
  ) {}

  @Query(() => Lore, {name: "lore", nullable: true})
  async getLore(@Args() args: FindUniqueLoreArgs): Promise<Lore | null> {
    return this.loreService.getLore(args);
  }

  @Query(() => [Lore], {name: "lores", nullable: false})
  async getLores(@Args() args: FindManyLoreArgs): Promise<Lore[]> {
    return this.loreService.getLores(args);
  }

  @Mutation(() => Lore, {nullable: false})
  async createLore(@Args() args: CreateOneLoreArgs): Promise<Lore> {
    // @ts-ignore
    return this.loreService.createLore(args);
  }

  @Mutation(() => Lore, {nullable: false})
  async updateLore(@Args() args: UpdateOneLoreArgs): Promise<Lore> {
    // @ts-ignore
    return this.loreService.updateLore(args);
  }

  @Mutation(() => Lore, {nullable: false})
  async deleteLore(@Args() args: DeleteOneLoreArgs): Promise<Lore> {
    return this.loreService.deleteLore(args);
  }

  @ResolveField(() => String, {name: "slug", nullable: false})
  async getSlug(@Root() lore: Lore): Promise<string> {
    return this.slugService.calculateSlug(
      lore.baseSlug,
      lore.slugDiscriminator
    );
  }

  @ResolveField(() => String, {name: "url", nullable: false})
  async getUrl(@Root() lore: Lore): Promise<string> {
    return this.loreService.getLoreUrl({id: lore.id});
  }

  @ResolveField(() => User, {name: "author", nullable: false})
  async getAuthor(@Root() lore: Lore): Promise<User> {
    return (await this.userService.getUser({
      where: {id: lore.authorId}
    })) as User;
  }

  @ResolveField(() => Realm, {name: "realm", nullable: false})
  async getRealm(@Root() lore: Lore): Promise<Realm> {
    return (await this.realmService.getRealm({
      where: {id: lore.realmId}
    })) as Realm;
  }
}
