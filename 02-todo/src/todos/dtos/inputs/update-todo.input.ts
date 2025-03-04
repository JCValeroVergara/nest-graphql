import { Field, InputType, Int } from '@nestjs/graphql';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';


@InputType()
export class UpdateTodoInput {

    @Field(() => Int)
    @IsInt()
    @Min(1)
    id: number;
    
    @Field(() => String, { description: 'What needs to be done?', nullable: true })
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    @IsOptional()
    description?: string;

    @Field(() => Boolean, { description: 'Is the task done?', nullable: true })
    @IsBoolean()
    @IsOptional()
    done?: boolean;
    
}