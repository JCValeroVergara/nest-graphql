import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { AuthResponse } from './types';
import { LoginInput, SignupInput } from './dtos';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    private getJwtToken(userId: string): string {
        return this.jwtService.sign({ id: userId });
    }

    async signup(signupInput: SignupInput): Promise<AuthResponse> {

        const user = await this.usersService.create(signupInput);
        
        const token = this.getJwtToken(user.id);

        return { token, user }
    }

    async login(loginInput: LoginInput): Promise<AuthResponse> {
        
        const { email, password } = loginInput;
        const user = await this.usersService.findOneByEmail(email);
        if (!bcrypt.compareSync(password, user.password)) {
            throw new BadRequestException('Invalid credentials');
        }
        const token = this.getJwtToken(user.id);

        return { token, user }
    }

    async validateUser(id: string): Promise<User> {
        const user = await this.usersService.findOneById(id);
        if(!user.isActive)
            throw new BadRequestException('User is blocked, contact support');
        delete user.password;
        return user;
    }

    revalidateToken(user: User): AuthResponse {
        const token = this.getJwtToken(user.id);
        return { token, user }
    }
}
