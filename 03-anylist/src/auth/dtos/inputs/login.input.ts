import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, MinLength } from 'class-validator';

@InputType()
export class LoginInput {

    @Field(() => String)
    @IsEmail()
    email: string;

    @Field(() => String)
    @Field()
    @MinLength(6)
    password: string;
}