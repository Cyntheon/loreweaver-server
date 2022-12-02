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
import {UserService} from "../user/user.service";
import {LoreService} from "./lore.service";

@Resolver(() => Lore)
export class LoreResolver {
  constructor(
    private lores: LoreService,
    private users: UserService,
    private realms: RealmService
  ) {}

  @Query(() => Lore, {name: "lore", nullable: true})
  async getLore(@Args() args: FindUniqueLoreArgs): Promise<Lore | null> {
    return this.lores.getLore(args);
  }

  @Query(() => [Lore], {name: "lores", nullable: false})
  async getLores(@Args() args: FindManyLoreArgs): Promise<Lore[]> {
    return this.lores.getLores(args);
  }

  @Mutation(() => Lore, {nullable: false})
  async createLore(@Args() args: CreateOneLoreArgs): Promise<Lore> {
    return this.lores.createLore(args);
  }

  @Mutation(() => Lore, {nullable: false})
  async updateLore(@Args() args: UpdateOneLoreArgs): Promise<Lore> {
    return this.lores.updateLore(args);
  }

  @Mutation(() => Lore, {nullable: false})
  async deleteLore(@Args() args: DeleteOneLoreArgs): Promise<Lore> {
    return this.lores.deleteLore(args);
  }

  @ResolveField(() => User, {name: "author", nullable: false})
  async getAuthor(@Root() lore: Lore): Promise<User> {
    return (await this.users.getUser({where: {id: lore.authorId}})) as User;
  }

  @ResolveField(() => Realm, {name: "realm", nullable: false})
  async getRealm(@Root() lore: Lore): Promise<Realm> {
    return (await this.realms.getRealm({where: {id: lore.realmId}})) as Realm;
  }
}
