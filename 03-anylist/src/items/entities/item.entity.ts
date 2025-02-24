import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { ListItem } from 'src/list-item/entities';
import { User } from 'src/users/entities';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'items' })
@ObjectType()
export class Item {
    

    @PrimaryGeneratedColumn('uuid')
    @Field( () => ID)
    id: string;

    @Column()
    @Field(() => String)
    name: string;

    // @Column()
    // @Field(() => Float)
    // quantity: number;

    @Column({nullable: true})
    @Field(() => String, { nullable: true })
    quantityUnits?: string;


    //* User relation
    @ManyToOne(() => User, user => user.items, { nullable: false, lazy: true })
    @Index('userId-index')
    @Field(() => User)
    user: User;

    //* List relation
    @OneToMany(() => ListItem, listItem => listItem.item, { lazy: true })
    @Field(() => [ListItem])
    listItem: ListItem[];

}
