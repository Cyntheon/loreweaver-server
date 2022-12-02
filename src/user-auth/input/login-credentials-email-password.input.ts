import {Field, InputType} from "@nestjs/graphql";

@InputType()
export class LoginCredentialsEmailPasswordInput {
  @Field(() => String, {nullable: false})
  public email!: string;

  @Field(() => String, {nullable: false})
  public password!: string;
}
