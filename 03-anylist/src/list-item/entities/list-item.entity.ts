import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { ObjectType, Field, Int, ID } from '@nestjs/graphql';


import { Item } from 'src/items/entities';
import { List } from 'src/lists/entities';

@Entity('list_item')
@Unique('listItem-item', ['list', 'item'])
@ObjectType()
export class ListItem {
    
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID)
    id: string;

    @Column({ type: 'numeric' })
    @Field(() => Number)
    quantity: number;


    @Column({ type: 'boolean' })
    @Field(() => Boolean)
    completed: boolean;


    //* Relations

    @ManyToOne(() => List, list => list.listItem, { lazy: true })
    @Field(() => List)
    list: List;

    @ManyToOne(() => Item, item => item.listItem, { lazy: true })
    @Field(() => Item)
    item: Item;

}
