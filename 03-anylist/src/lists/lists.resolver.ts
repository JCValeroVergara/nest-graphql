import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';

import { ListsService } from './lists.service';
import { List } from './entities/list.entity';
import { User } from 'src/users/entities';


import { PaginationArgs, SearchArgs } from 'src/common/dto';
import { CreateListInput, UpdateListInput } from './dto';
import { JwtAuthGuard } from 'src/auth/guards';
import { CurrentUser } from 'src/auth/decorators';

@Resolver(() => List)
@UseGuards( JwtAuthGuard)
export class ListsResolver {
    constructor(private readonly listsService: ListsService) {}

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
}
