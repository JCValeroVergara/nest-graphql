import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Item } from 'src/items/entities';
import { User } from 'src/users/entities';
import { SEED_ITEMS, SEED_USERS } from './data/seed-data';
import { UsersService } from 'src/users/users.service';
import { ItemsService } from 'src/items/items.service';

@Injectable()
export class SeedService {

    private isProd: boolean;

    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(Item)
        private readonly itemsRepository: Repository<Item>,
        private readonly itemsService: ItemsService,
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly usersService: UsersService,
    ) {
        this.isProd = this.configService.get('STATE') === 'prod';
    }


    async executeSeed(): Promise<boolean> {

        if (this.isProd) {
            throw new UnauthorizedException('No se puede ejecutar en producción');
        }

        //Limpiar la base de datos
        await this.clearDatabase();

        //Crear Usuarios
        const user = await this.loadUsers();

        //Crear Items
        await this.loadItems( user );

        return true;
    }

    async clearDatabase() {

        //Borrar Items
        await this.itemsRepository.createQueryBuilder().delete().where({}).execute();

        //Borrar Usuarios
        await this.usersRepository.createQueryBuilder().delete().where({}).execute();
    }

    async loadUsers(): Promise<User> { 
        const users = [];
        for (const user of SEED_USERS) { 
            users.push(await this.usersService.create(user));
        }
        return users[0];
    }

    async loadItems( user:User): Promise<void> {
        const items = [];
        for (const item of SEED_ITEMS) {
            items.push( this.itemsService.create(item, user) );
        }
        await Promise.all(items);
    }
}

