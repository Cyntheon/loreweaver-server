import {Lore} from "@generated/lore";
import {
  CreateOneRealmArgs,
  DeleteOneRealmArgs,
  FindManyRealmArgs,
  FindUniqueRealmArgs,
  Realm,
  UpdateOneRealmArgs
} from "@generated/realm";
import {User} from "@generated/user";
import {
  Args,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Root
} from "@nestjs/graphql";
import {LoreService} from "../lore/lore.service";
import {UserService} from "../user/user.service";
import {RealmService} from "./realm.service";

@Resolver(() => Realm)
export class RealmResolver {
  constructor(
    private realms: RealmService,
    private users: UserService,
    private lores: LoreService
  ) {}

  @Query(() => Realm, {name: "realm", nullable: true})
  async getRealm(@Args() args: FindUniqueRealmArgs): Promise<Realm | null> {
    return this.realms.getRealm(args);
  }

  @Query(() => [Realm], {name: "realms", nullable: false})
  async getRealms(@Args() args: FindManyRealmArgs): Promise<Realm[]> {
    return this.realms.getRealms(args);
  }

  @Mutation(() => Realm, {nullable: false})
  async createRealm(@Args() args: CreateOneRealmArgs): Promise<Realm> {
    return this.realms.createRealm(args);
  }

  @Mutation(() => Realm, {nullable: false})
  async updateRealm(@Args() args: UpdateOneRealmArgs): Promise<Realm> {
    return this.realms.updateRealm(args);
  }

  @Mutation(() => Realm, {nullable: false})
  async deleteRealm(@Args() args: DeleteOneRealmArgs): Promise<Realm> {
    return this.realms.deleteRealm(args);
  }

  @ResolveField(() => User, {name: "author", nullable: false})
  async getAuthor(@Root() realm: Realm): Promise<User> {
    return (await this.users.getUser({where: {id: realm.authorId}})) as User;
  }

  @ResolveField(() => [Lore], {name: "lores", nullable: false})
  async getLores(@Root() realm: Realm): Promise<Lore[]> {
    return this.lores.getLores({where: {realmId: realm.id}});
  }

  @ResolveField(() => Lore, {name: "representationLore", nullable: false})
  async getRepresentationLore(@Root() realm: Realm): Promise<Lore> {
    return (await this.lores.getLore({
      where: {id: realm.representationLoreId as string}
    })) as Lore;
  }
}
