import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput, SignupInput } from './dtos';
import { AuthResponse } from './types';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards';
import { CurrentUser } from './decorators';
import { User } from 'src/users/entities';


@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) { }
    

    @Mutation(() => AuthResponse, { name: 'signup' })
    async signup(
        @Args('singupInput') singupInput: SignupInput
    ): Promise<AuthResponse> {
        return this.authService.signup( singupInput);
    }

    @Mutation(() => AuthResponse, { name: 'login' })
    async login(
        @Args('loginInput') loginInput: LoginInput
    ): Promise<AuthResponse> {
        return this.authService.login( loginInput );
    }

    @Query(() => AuthResponse, { name: 'revalite' })
    @UseGuards( JwtAuthGuard)
    revaliteToken(
        @CurrentUser() user: User
    ): AuthResponse {
        return this.authService.revalidateToken( user);
    }
}
