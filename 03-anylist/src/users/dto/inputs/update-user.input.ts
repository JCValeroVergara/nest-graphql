import { IsArray, IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { CreateUserInput } from './create-user.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { ValidRoles } from 'src/auth/enums';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
    @Field(() => ID)
    @IsUUID()
    id: string;

    @Field(() => [ValidRoles], { nullable: true })
    @IsArray()
    @IsOptional()
    roles?: ValidRoles[];

    @Field(()=>Boolean, { nullable: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
