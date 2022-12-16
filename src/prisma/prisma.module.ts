import {Module} from "@nestjs/common";
import {PrismaService, PrismaUtilsService} from ".";

@Module({
  providers: [PrismaService, PrismaUtilsService],
  exports: [PrismaService, PrismaUtilsService]
})
export class PrismaModule {}
