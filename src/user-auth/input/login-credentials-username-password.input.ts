import {Field, InputType} from "@nestjs/graphql";

@InputType()
export class LoginCredentialsUsernamePasswordInput {
  @Field(() => String, {nullable: false})
  public username!: string;

  @Field(() => String, {nullable: false})
  public password!: string;
}
