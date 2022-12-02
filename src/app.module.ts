import {ApolloDriver, ApolloDriverConfig} from "@nestjs/apollo";
import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {GraphQLModule} from "@nestjs/graphql";
import {ApolloServerPluginLandingPageLocalDefault} from "apollo-server-core";
import depthLimit from "graphql-depth-limit";
import {join} from "node:path";
import {PrismaModule} from "./prisma/prisma.module";
import {UserModule} from "./user/user.module";
import {UserAuthModule} from "./user-auth/user-auth.module";
import {AuditLogEntryModule} from "./audit-log-entry/audit-log-entry.module";
import {FollowTargetModule} from "./follow-target/follow-target.module";
import {UserProfileModule} from "./user-profile/user-profile.module";
import {FollowModule} from "./follow/follow.module";
import {ContentModule} from "./content/content.module";
import {RealmModule} from "./realm/realm.module";
import {LoreModule} from "./lore/lore.module";
import {PostModule} from "./post/post.module";
import {CollectionModule} from "./collection/collection.module";
import { SlugModule } from './slug/slug.module';
import { ShortcodeModule } from './shortcode/shortcode.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      sortSchema: true,
      introspection: true,
      playground: false,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      csrfPrevention: true,
      cache: "bounded",
      validationRules: [depthLimit(7)]
    }),
    PrismaModule,
    UserModule,
    UserAuthModule,
    AuditLogEntryModule,
    FollowTargetModule,
    UserProfileModule,
    FollowModule,
    ContentModule,
    RealmModule,
    LoreModule,
    PostModule,
    CollectionModule,
    SlugModule,
    ShortcodeModule,
    CommentModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
