import {forwardRef, Module} from "@nestjs/common";
import {LoreModule} from "../lore/lore.module";
import {UserModule} from "../user/user.module";
import {RealmSlugService} from "./realm-slug.service";
import {RealmUrlService} from "./realm-url.service";
import {RealmService} from "./realm.service";
import {RealmResolver} from "./realm.resolver";

@Module({
  providers: [
    RealmService,
    RealmSlugService,
    RealmUrlService,
    RepresentationLoreService,
    RealmResolver
  ],
  imports: [forwardRef(() => UserModule), forwardRef(() => LoreModule)],
  exports: [RealmService, RealmSlugService, RealmUrlService]
})
export class RealmModule {}
