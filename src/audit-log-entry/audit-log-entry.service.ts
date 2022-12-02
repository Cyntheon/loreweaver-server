import {Injectable} from "@nestjs/common";
import {Prisma} from "@prisma/client";
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class AuditLogEntryService {
  constructor(private prisma: PrismaService) {}

  async getAuditLogEntry(args: Prisma.AuditLogEntryFindUniqueArgs) {
    return this.prisma.auditLogEntry.findUnique(args);
  }

  async getAuditLogEntries(args: Prisma.AuditLogEntryFindManyArgs) {
    return this.prisma.auditLogEntry.findMany(args);
  }

  async createAuditLogEntry(args: Prisma.AuditLogEntryCreateArgs) {
    return this.prisma.auditLogEntry.create(args);
  }

  async updateAuditLogEntry(args: Prisma.AuditLogEntryUpdateArgs) {
    return this.prisma.auditLogEntry.update(args);
  }

  async deleteAuditLogEntry(args: Prisma.AuditLogEntryDeleteArgs) {
    return this.prisma.auditLogEntry.delete(args);
  }
}
