import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignupInput } from './dtos';
import { AuthResponse } from './types';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) { }
    

    @Mutation(() => AuthResponse, { name: 'signup' })
    async signup(
        @Args('singupInput') singupInput: SignupInput
    ): Promise<AuthResponse> {
        return this.authService.signup( singupInput);
    }

    // @Mutation(() => String, { name: 'login' })
    // async login(): Promise<string> {
    //     return this.authService.login();
    // }

    // @Query(() => String, { name: 'revalite' })
    // async revaliteToken(): Promise<string> {
    //     return this.authService.revaliteToken();
    // }
}
