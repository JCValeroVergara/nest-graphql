import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class SignupInput {

    @Field(() => String)
    @IsEmail()
    email: string;

    @Field(() => String)
    @Field()
    @IsNotEmpty()
    fullName: string;

    @Field(() => String)
    @Field()
    @MinLength(6)
    password: string;
}