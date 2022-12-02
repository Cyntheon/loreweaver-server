import {Global, Module} from "@nestjs/common";
import {ShortcodeService} from "./shortcode.service";
import {ShortcodeResolver} from "./shortcode.resolver";

@Global()
@Module({
  providers: [ShortcodeService, ShortcodeResolver],
  imports: [],
  exports: [ShortcodeService]
})
export class ShortcodeModule {}
