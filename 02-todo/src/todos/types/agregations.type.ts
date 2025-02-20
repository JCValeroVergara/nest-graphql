import { Field, Int, ObjectType } from '@nestjs/graphql';


@ObjectType({ description: 'Agregations Todos' })
export class AgregationsType { 

    @Field(() => Int)
    total: number;

    @Field(() => Int)
    completed: number;

    @Field(() => Int)
    pending: number;
}