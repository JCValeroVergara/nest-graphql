import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, ID, ResolveField, Int, Parent } from '@nestjs/graphql';

import { JwtAuthGuard } from 'src/auth/guards';
import { CurrentUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/enums';

import { User } from './entities/user.entity';
import { Item } from 'src/items/entities';

import { UpdateUserInput, ValidRolesArgs } from './dto';
import { PaginationArgs, SearchArgs } from 'src/common/dto';

import { UsersService } from './users.service';
import { ItemsService } from 'src/items/items.service';
import { ListsService } from 'src/lists/lists.service';
import { List } from 'src/lists/entities';


@Resolver(() => User)
@UseGuards( JwtAuthGuard)
export class UsersResolver {
    constructor(
        private readonly usersService: UsersService,
        private readonly itemsService: ItemsService,
        private readonly listsService: ListsService
    ) { }

    @Query(() => [User], { name: 'users' })
    findAll(
        @Args() validRoles: ValidRolesArgs,
        @CurrentUser([ValidRoles.superUser, ValidRoles.admin]) user: User
    ): Promise<User[]> {
        
        return this.usersService.findAll( validRoles.roles);
    }

    @Query(() => User, { name: 'user' })
    findOne(
        @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
        @CurrentUser([ValidRoles.superUser, ValidRoles.admin]) user: User
    ): Promise<User> {
        return this.usersService.findOneById(id);
    }

    @Mutation(() => User , { name: 'updateUser' })
    updateUser(
        @Args('updateUserInput') updateUserInput: UpdateUserInput,
        @CurrentUser([ ValidRoles.admin]) user: User
    ): Promise<User> {
        return this.usersService.update(updateUserInput.id, updateUserInput, user);
    }

    @Mutation(() => User, { name: 'blockUser' })
    blockUser(
        @Args('id', { type: () => ID }) id: string,
        @CurrentUser([ValidRoles.admin]) user: User
    ): Promise<User> {
        return this.usersService.blockUser(id, user);
    }

    @ResolveField(()=> Int, { name: 'itemCount' })
    async itemCount(
        @CurrentUser([ValidRoles.admin]) adminUser: User,
        @Parent() user: User
    ): Promise<number> {
        return this.itemsService.itemCountByUser(user);
    }
    
    @ResolveField(()=> [Item], { name: 'items' })
    async getItemsByUser(
        @CurrentUser([ValidRoles.admin]) adminUser: User,
        @Parent() user: User,
        @Args() paginationArgs: PaginationArgs,
        @Args() searchArgs : SearchArgs,
    ): Promise<Item[]> {
        return this.itemsService.findAll( user, paginationArgs, searchArgs);
    }

    @ResolveField(()=> Int, { name: 'listCount' })
    async listCount(
        @CurrentUser([ValidRoles.admin]) adminUser: User,
        @Parent() user: User
    ): Promise<number> {
        return this.listsService.listsCountByUser(user);
    }
    
    @ResolveField(()=> [List], { name: 'lists' })
    async getListsByUser(
        @CurrentUser([ValidRoles.admin]) adminUser: User,
        @Parent() user: User,
        @Args() paginationArgs: PaginationArgs,
        @Args() searchArgs : SearchArgs,
    ): Promise<List[]> {
        return this.listsService.findAll( user, paginationArgs, searchArgs);
    }
}
