import {Injectable} from "@nestjs/common";
import {Prisma} from "@prisma/client";
import {PrismaCreateArgs, PrismaCreateInput} from "../@types";
import {PrismaService} from "../prisma";
import {IdService} from "../id";

type AuditLogEntryCreateArgs = PrismaCreateArgs<
  Prisma.AuditLogEntryCreateArgs,
  Prisma.AuditLogEntryCreateInput
>;

@Injectable()
export class AuditLogEntryService {
  constructor(private prisma: PrismaService, private uuid: IdService) {}

  async getAuditLogEntry(args: Prisma.AuditLogEntryFindUniqueArgs) {
    return this.prisma.auditLogEntry.findUnique(args);
  }

  async getAuditLogEntries(args: Prisma.AuditLogEntryFindManyArgs) {
    return this.prisma.auditLogEntry.findMany(args);
  }

  async createAuditLogEntry(args: AuditLogEntryCreateArgs) {
    return this.prisma.auditLogEntry.create(
      this.uuid.injectIdIntoArgs<
        PrismaCreateInput<Prisma.AuditLogEntryCreateInput>,
        AuditLogEntryCreateArgs
      >(args)
    );
  }

  async updateAuditLogEntry(args: Prisma.AuditLogEntryUpdateArgs) {
    return this.prisma.auditLogEntry.update(args);
  }

  async deleteAuditLogEntry(args: Prisma.AuditLogEntryDeleteArgs) {
    return this.prisma.auditLogEntry.delete(args);
  }
}
