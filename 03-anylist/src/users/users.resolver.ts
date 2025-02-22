import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserInput, ValidRolesArgs } from './dto';
import { JwtAuthGuard } from 'src/auth/guards';
import { CurrentUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/enums';


@Resolver(() => User)
@UseGuards( JwtAuthGuard)
export class UsersResolver {
    constructor(private readonly usersService: UsersService) {}

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
}
