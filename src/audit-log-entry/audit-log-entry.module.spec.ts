import {Test, TestingModule} from "@nestjs/testing";
import {
  AuditLogEntryModule,
  AuditLogEntryResolver,
  AuditLogEntryService
} from ".";
import {GlobalModule} from "../global/global.module";

describe("AuditLogEntryModule", () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AuditLogEntryModule, GlobalModule]
    }).compile();
  });

  it("should be defined", () => {
    expect(module).toBeDefined();
  });

  it("should compile with all providers and imports", () => {
    expect(module.get(AuditLogEntryService)).toBeInstanceOf(
      AuditLogEntryService
    );
    expect(module.get(AuditLogEntryResolver)).toBeInstanceOf(
      AuditLogEntryResolver
    );
  });
});
