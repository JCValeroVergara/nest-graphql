import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { ListItem } from 'src/list-item/entities';
import { User } from 'src/users/entities';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'lists' })
@ObjectType()
export class List {
    
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID)
    id: string;

    @Column()
    @Field(() => String)
    name: string;

    //Relacion e index('userId-list-index') para mejorar la busqueda
    @ManyToOne(() => User, user => user.list, { nullable: false, lazy: true })
    @Index('userId-list-index')
    @Field(() => User)
    user: User;

    @OneToMany(() => ListItem, listItem => listItem.list)
    // @Field(() => [ListItem])
    listItem: ListItem[];
}
