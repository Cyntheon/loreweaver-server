import {forwardRef, Module} from "@nestjs/common";
import {CollectionModule} from "../collection/collection.module";
import {CommentModule} from "../comment/comment.module";
import {LoreModule} from "../lore/lore.module";
import {PostModule} from "../post/post.module";
import {RealmModule} from "../realm/realm.module";
import {UserProfileModule} from "../user-profile/user-profile.module";
import {UserResolver} from "./user.resolver";
import {UserService} from "./user.service";

@Module({
  providers: [UserService, UserResolver],
  imports: [
    forwardRef(() => UserProfileModule),
    forwardRef(() => RealmModule),
    forwardRef(() => LoreModule),
    forwardRef(() => PostModule),
    forwardRef(() => CommentModule),
    forwardRef(() => CollectionModule)
  ],
  exports: [UserService]
})
export class UserModule {}
