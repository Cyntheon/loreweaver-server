import {Global, Module} from "@nestjs/common";
import {PrismaModule, PrismaService, PrismaUtilsService} from "../prisma";
import {ArgonService, UserAuthModule, UserAuthService} from "../user-auth";
import {IdModule, IdService} from "../id";

@Global()
@Module({
  providers: [],
  imports: [PrismaModule, UserAuthModule, IdModule],
  exports: [
    PrismaService,
    PrismaUtilsService,
    UserAuthService,
    ArgonService,
    IdService
  ]
})
export class GlobalModule {}
