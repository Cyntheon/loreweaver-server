import {INestApplication} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "./app.module";
import {AuditLogEntryModule} from "./audit-log-entry";
import {CollectionModule} from "./collection";
import {CommentModule} from "./comment";
import {ContentTargetModule} from "./content-target";
import {FollowModule} from "./follow";
import {FollowTargetModule} from "./follow-target";
import {LoreModule} from "./lore";
import {PostModule} from "./post";
import {PrismaModule} from "./prisma";
import {RealmModule} from "./realm";
import {ShortcodeModule} from "./shortcode";
import {SlugModule} from "./slug";
import {UserModule} from "./user";
import {UserAuthModule} from "./user-auth";
import {UserProfileModule} from "./user-profile";
import {IdModule} from "./id";

describe("AppModule", () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();
  });

  it("should be defined", () => {
    expect(module).toBeDefined();
  });

  // TO-DO: Fix "Cannot find module '@generated/audit-log-entry' from 'src/audit-log-entry/audit-log-entry.resolver.ts'..."
  it("should compile with all providers and imports", () => {
    expect(module.get(PrismaModule)).toBeInstanceOf(PrismaModule);
    expect(module.get(UserAuthModule)).toBeInstanceOf(UserAuthModule);
    expect(module.get(IdModule)).toBeInstanceOf(IdModule);
    expect(module.get(AuditLogEntryModule)).toBeInstanceOf(AuditLogEntryModule);
    expect(module.get(CollectionModule)).toBeInstanceOf(CollectionModule);
    expect(module.get(CommentModule)).toBeInstanceOf(CommentModule);
    expect(module.get(ContentTargetModule)).toBeInstanceOf(ContentTargetModule);
    expect(module.get(FollowModule)).toBeInstanceOf(FollowModule);
    expect(module.get(FollowTargetModule)).toBeInstanceOf(FollowTargetModule);
    expect(module.get(LoreModule)).toBeInstanceOf(LoreModule);
    expect(module.get(PostModule)).toBeInstanceOf(PostModule);
    expect(module.get(RealmModule)).toBeInstanceOf(RealmModule);
    expect(module.get(ShortcodeModule)).toBeInstanceOf(ShortcodeModule);
    expect(module.get(SlugModule)).toBeInstanceOf(SlugModule);
    expect(module.get(UserModule)).toBeInstanceOf(UserModule);
    expect(module.get(UserProfileModule)).toBeInstanceOf(UserProfileModule);
  });
});
