import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int, ID, ResolveField, Parent } from '@nestjs/graphql';

import { ListsService } from './lists.service';
import { ListItemService } from 'src/list-item/list-item.service';
import { List } from './entities/list.entity';
import { User } from 'src/users/entities';
import { ListItem } from 'src/list-item/entities';


import { PaginationArgs, SearchArgs } from 'src/common/dto';
import { CreateListInput, UpdateListInput } from './dto';
import { JwtAuthGuard } from 'src/auth/guards';
import { CurrentUser } from 'src/auth/decorators';

@Resolver(() => List)
@UseGuards( JwtAuthGuard)
export class ListsResolver {
    constructor(
        private readonly listsService: ListsService,
        private readonly listItemService: ListItemService,
    ) { }

    @Mutation(() => List)
    async createList(
        @Args('createListInput') createListInput: CreateListInput,
        @CurrentUser() user: User
    ): Promise<List> {
        return this.listsService.create(createListInput, user);
    }

    @Query(() => [List], { name: 'lists' })
    async findAll(
        @CurrentUser() user: User,
        @Args() paginationArgs: PaginationArgs,
        @Args() searchArgs: SearchArgs
    ): Promise<List[]> {
        return this.listsService.findAll(user, paginationArgs, searchArgs);
    }

    @Query(() => List, { name: 'list' })
    async findOne(
        @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
        @CurrentUser() user: User
    ): Promise<List> {
        return this.listsService.findOne(id, user);
    }

    @Mutation(() => List)
    updateList(
        @Args('updateListInput') updateListInput: UpdateListInput,
        @CurrentUser() user: User
    ): Promise<List> {
        return this.listsService.update(updateListInput.id, updateListInput, user);
    }

    @Mutation(() => List)
    removeList(
        @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
        @CurrentUser() user: User
    ): Promise<List> {
        return this.listsService.remove(id, user);
    }

    @ResolveField(() =>[ListItem], { name: 'items' })
    async getListItems(
        @Parent() list: List,
        @Args() paginationArgs: PaginationArgs,
        @Args() searchArgs: SearchArgs,
    ): Promise<ListItem[]> {
        return this.listItemService.findAll(list, paginationArgs, searchArgs);
    }

    @ResolveField(() => Number, { name: 'totalItems' })
    async countListItemsByList(
        @Parent()list: List
    ): Promise<number> {
        return this.listItemService.counteListItemsByList(list);
    }
}
