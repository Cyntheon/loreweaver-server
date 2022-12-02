import {forwardRef, Module} from "@nestjs/common";
import {LoreModule} from "../lore/lore.module";
import {UserModule} from "../user/user.module";
import {RealmService} from "./realm.service";
import {RealmResolver} from "./realm.resolver";

@Module({
  providers: [RealmService, RealmResolver],
  imports: [forwardRef(() => UserModule), forwardRef(() => LoreModule)],
  exports: [RealmService]
})
export class RealmModule {}
