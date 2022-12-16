import {ApolloDriver, ApolloDriverConfig} from "@nestjs/apollo";
import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {GraphQLModule} from "@nestjs/graphql";
import {ApolloServerPluginLandingPageLocalDefault} from "apollo-server-core";
import depthLimit from "graphql-depth-limit";
import {join} from "node:path";
import {AuditLogEntryModule} from "./audit-log-entry";
import {CollectionModule} from "./collection";
import {CommentModule} from "./comment";
import {ContentTargetModule} from "./content-target";
import {FollowModule} from "./follow";
import {FollowTargetModule} from "./follow-target";
import {GlobalModule} from "./global";
import {IdModule} from "./id";
import {LoreModule} from "./lore";
import {PostModule} from "./post";
import {PrismaModule} from "./prisma";
import {RealmModule} from "./realm";
import {ShortcodeModule} from "./shortcode";
import {SlugModule} from "./slug";
import {UserModule} from "./user";
import {UserAuthModule} from "./user-auth";
import {UserProfileModule} from "./user-profile";

@Module({
  imports: [
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
    ConfigModule.forRoot({isGlobal: true}),
    // Global Modules
    GlobalModule,
    PrismaModule,
    UserAuthModule,
    IdModule,
    // Domain Modules
    AuditLogEntryModule,
    CollectionModule,
    CommentModule,
    ContentTargetModule,
    FollowModule,
    FollowTargetModule,
    LoreModule,
    PostModule,
    RealmModule,
    ShortcodeModule,
    SlugModule,
    UserModule,
    UserProfileModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
