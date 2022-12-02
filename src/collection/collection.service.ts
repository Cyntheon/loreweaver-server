import {Injectable} from "@nestjs/common";
import {Prisma} from "@prisma/client";
import {PrismaService} from "../prisma/prisma.service";
import {SlugService} from "../slug/slug.service";

@Injectable()
export class CollectionService {
  constructor(
    private prisma: PrismaService,
    private slugService: SlugService
  ) {}

  async getCollection(args: Prisma.CollectionFindUniqueArgs) {
    return this.prisma.collection.findUnique(args);
  }
}
