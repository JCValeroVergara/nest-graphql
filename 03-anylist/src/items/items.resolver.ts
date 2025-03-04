import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { ItemsService } from './items.service';
import { CreateItemInput, UpdateItemInput } from './dto';
import { JwtAuthGuard } from 'src/auth/guards';
import { CurrentUser } from 'src/auth/decorators';

import { Item } from './entities/item.entity';
import { User } from 'src/users/entities';
import { PaginationArgs, SearchArgs } from 'src/common/dto';

@Resolver(() => Item)
@UseGuards( JwtAuthGuard )
export class ItemsResolver {
    constructor(private readonly itemsService: ItemsService) {}

    @Mutation(() => Item, { name: 'createItem' })
    async createItem(
        @Args('createItemInput') createItemInput: CreateItemInput,
        @CurrentUser() user: User
    ): Promise<Item> {
        return this.itemsService.create(createItemInput, user);
    }

    @Query(() => [Item], { name: 'items' })
    async findAll(
        @CurrentUser() user: User,
        @Args() paginationArgs: PaginationArgs,
        @Args() searchArgs: SearchArgs
    ): Promise<Item[]> {
        return this.itemsService.findAll( user, paginationArgs, searchArgs );
    }

    @Query(() => Item, { name: 'item' })
    findOne(
        @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
        @CurrentUser() user: User
    ): Promise<Item> {
        return this.itemsService.findOne(id, user);
    }

    @Mutation(() => Item)
    updateItem(
        @Args('updateItemInput') updateItemInput: UpdateItemInput,
        @CurrentUser() user: User
    ): Promise<Item> {
        return this.itemsService.update(updateItemInput.id, updateItemInput, user);
    }

    @Mutation(() => Item)
    removeItem(
        @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
        @CurrentUser() user: User
    ): Promise<Item> {
        return this.itemsService.remove(id, user);
    }
}
