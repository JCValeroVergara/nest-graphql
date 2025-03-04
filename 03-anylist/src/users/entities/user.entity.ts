import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Item } from 'src/items/entities';
import { List } from 'src/lists/entities';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
@ObjectType()
export class User {

    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID)
    id: string;

    @Column()
    @Field(() => String)
    fullName: string;

    @Column({ unique: true })
    @Field(() => String)
    email: string;

    @Column()
    password: string;

    @Column({
        type: 'text',
        array: true,
        default: ['user']
    })
    @Field(() => [String])
    roles: string[];

    @Column({ 
        type: 'boolean', 
        default: true
    })
    @Field(() => Boolean)
    isActive: boolean;

    //* Relations
    @ManyToOne(() => User, user => user.lastUpdatedBy, { nullable: true, lazy: true })
    @JoinColumn({ name: 'last_updated_by' })
    @Field(() => User, { nullable: true })
    lastUpdatedBy?: User;

    @OneToMany(() => Item, item => item.user, { lazy: true })
    // @Field(() => [Item])
    items: Item[];

    @OneToMany(() => List, list => list.user, { lazy: true })
    // @Field(() => [Item])
    list: List[];
}