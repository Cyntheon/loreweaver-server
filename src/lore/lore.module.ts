import {forwardRef, Module} from "@nestjs/common";
import {RealmModule} from "../realm/realm.module";
import {UserModule} from "../user/user.module";
import {LoreService} from "./lore.service";
import {LoreResolver} from "./lore.resolver";

@Module({
  providers: [LoreService, LoreResolver],
  imports: [forwardRef(() => UserModule), forwardRef(() => RealmModule)],
  exports: [LoreService]
})
export class LoreModule {}
