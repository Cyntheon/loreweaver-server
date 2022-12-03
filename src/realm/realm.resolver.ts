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
  Parent,
  Query,
  ResolveField,
  Resolver
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
    return this.realms.getManyRealms(args);
  }

  @Mutation(() => Realm, {nullable: false})
  async createRealm(@Args() args: CreateOneRealmArgs): Promise<Realm> {
    // @ts-ignore
    return this.realms.createRealm(args);
  }

  @Mutation(() => Realm, {nullable: false})
  async updateRealm(@Args() args: UpdateOneRealmArgs): Promise<Realm> {
    // @ts-ignore
    return this.realms.updateRealm(args);
  }

  @Mutation(() => Realm, {nullable: false})
  async deleteRealm(@Args() args: DeleteOneRealmArgs): Promise<Realm> {
    return this.realms.deleteRealm(args);
  }

  @ResolveField(() => User, {name: "author", nullable: false})
  async getAuthor(@Parent() realm: Realm): Promise<User> {
    return (await this.users.getUser({where: {id: realm.authorId}})) as User;
  }

  @ResolveField(() => [Lore], {name: "lores", nullable: false})
  async getManyLores(@Parent() realm: Realm): Promise<Lore[]> {
    return this.lores.getManyLores({where: {realmId: realm.id}});
  }

  @ResolveField(() => Lore, {name: "representationLore", nullable: false})
  async getRepresentationLore(@Parent() realm: Realm): Promise<Lore> {
    return (await this.lores.getLore({
      where: {id: realm.representationLoreId as string}
    })) as Lore;
  }
}
