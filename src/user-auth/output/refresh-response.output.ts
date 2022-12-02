import {Field, ObjectType} from "@nestjs/graphql";
import {User} from "@generated/user";

@ObjectType()
export class RefreshResponse {
  @Field(() => String, {nullable: false})
  public accessToken!: string;

  @Field(() => String, {nullable: false})
  public refreshToken!: string;

  @Field(() => User, {nullable: false})
  public user!: User;
}
