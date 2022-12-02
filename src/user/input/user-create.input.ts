import {Field, InputType} from "@nestjs/graphql";
import {GraphQLEmailAddress} from "graphql-scalars";
import {UserCreateInput as GeneratedUserCreateInput} from "@generated/user";

@InputType()
export class UserCreateInput extends GeneratedUserCreateInput {
  @Field(() => String, {nullable: false})
  public username!: string;

  @Field(() => GraphQLEmailAddress, {nullable: false})
  public email!: string;

  @Field(() => String, {nullable: false})
  public password!: string;
}
