import {
  AuditLogEntry,
  CreateOneAuditLogEntryArgs,
  DeleteOneAuditLogEntryArgs,
  FindManyAuditLogEntryArgs,
  FindUniqueAuditLogEntryArgs,
  UpdateOneAuditLogEntryArgs
} from "@generated/audit-log-entry";
import {Args, Mutation, Query, Resolver} from "@nestjs/graphql";
import {AuditLogEntryService} from "./audit-log-entry.service";

@Resolver(() => AuditLogEntry)
export class AuditLogEntryResolver {
  constructor(private auditLogEntryService: AuditLogEntryService) {}

  @Query(() => AuditLogEntry, {name: "auditLogEntry", nullable: true})
  async getAuditLogEntry(
    @Args() args: FindUniqueAuditLogEntryArgs
  ): Promise<AuditLogEntry | null> {
    return this.auditLogEntryService.getAuditLogEntry(args);
  }

  @Query(() => [AuditLogEntry], {name: "auditLogEntries", nullable: false})
  async getAuditLogEntries(
    @Args() args: FindManyAuditLogEntryArgs
  ): Promise<AuditLogEntry[]> {
    return this.auditLogEntryService.getAuditLogEntries(args);
  }

  @Mutation(() => AuditLogEntry, {nullable: false})
  async createAuditLogEntry(
    @Args() args: CreateOneAuditLogEntryArgs
  ): Promise<AuditLogEntry> {
    return this.auditLogEntryService.createAuditLogEntry(args);
  }

  @Mutation(() => AuditLogEntry, {nullable: false})
  async updateAuditLogEntry(
    @Args() args: UpdateOneAuditLogEntryArgs
  ): Promise<AuditLogEntry> {
    return this.auditLogEntryService.updateAuditLogEntry(args);
  }

  @Mutation(() => AuditLogEntry, {nullable: false})
  async deleteAuditLogEntry(
    @Args() args: DeleteOneAuditLogEntryArgs
  ): Promise<AuditLogEntry> {
    return this.auditLogEntryService.deleteAuditLogEntry(args);
  }
}
