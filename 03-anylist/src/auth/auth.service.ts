import { Injectable } from '@nestjs/common';
import { AuthResponse } from './types';
import { SignupInput } from './dtos';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
    ) { }

    async signup(signupInput: SignupInput): Promise<AuthResponse> {

        const user = await this.usersService.create(signupInput);
        
        const token = 'Abcedfghijklmnopqrstuvwxyz';

        return { token, user }
    }

}
