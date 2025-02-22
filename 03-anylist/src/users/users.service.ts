import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';


import { User } from './entities';
import { SignupInput } from 'src/auth/dtos';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserInput } from './dto';
import { ValidRoles } from 'src/auth/enums';

@Injectable()
export class UsersService {

    private logger = new Logger('UsersService');

    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>
    ) { }


    async create( signupInput: SignupInput): Promise<User> {
        try {
            const newUser = this.usersRepository.create({
                ...signupInput,
                password: bcrypt.hashSync(signupInput.password, 10)
            });
            return await this.usersRepository.save(newUser);

        } catch (error) {
            this.handleDBError(error);
        }
    }

    async findAll(roles: ValidRoles[]): Promise<User[]> {
        
        if (roles.length === 0) return await this.usersRepository.find();
        
        //* This is a more efficient way to query the database
        return await this.usersRepository.createQueryBuilder()
            .andWhere('ARRAY[roles] && ARRAY[:...roles]')
            .setParameter('roles', roles)
            .getMany();
    }

    async findOneById(id: string):Promise<User> {
        try {
            return await this.usersRepository.findOneByOrFail({ id });
        } catch (error) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
    }

    async findOneByEmail(email: string): Promise<User> {
        try {
            return await this.usersRepository.findOneByOrFail({ email });
        } catch (error) {
            throw new NotFoundException(`User with email ${email} not found`);
        }
    }

    update(id: number, updateUserInput: UpdateUserInput) {
        return `This action updates a #${id} user`;
    }

    blockUser(id: string): Promise<User> {
        throw new Error('Method not implemented.');
    }

    private handleDBError(error: any): never {
        if (error.code === '23505') {
            throw new BadRequestException(error.detail.replace('Key',''));
        }
        this.logger.error(error);
        throw new InternalServerErrorException('Please check server logs');
    }
}
