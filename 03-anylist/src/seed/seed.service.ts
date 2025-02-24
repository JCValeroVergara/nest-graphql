import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Item } from 'src/items/entities';
import { List } from 'src/lists/entities';
import { ListItem } from 'src/list-item/entities';
import { User } from 'src/users/entities';
import { SEED_ITEMS, SEED_LISTS, SEED_USERS } from './data/seed-data';
import { ItemsService } from 'src/items/items.service';
import { ListItemService } from 'src/list-item/list-item.service';
import { ListsService } from 'src/lists/lists.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SeedService {

    private isProd: boolean;

    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(Item)
        private readonly itemsRepository: Repository<Item>,
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @InjectRepository(ListItem)
        private readonly listItemsRepository: Repository<ListItem>,
        @InjectRepository(List)
        private readonly listsRepository: Repository<List>,
        
        private readonly itemsService: ItemsService,
        private readonly usersService: UsersService,
        private readonly listItemsService: ListItemService,
        private readonly listsService: ListsService,
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
        await this.loadItems(user);
        
        //Crear Listas
        const list = await this.loadLists( user );

        //Crear ListItems
        const items = await this.itemsService.findAll(user,{ offset: 0, limit: 15 }, { search: '' });
        await this.loadListItems(list, items );


        return true;
    }

    async clearDatabase() {

        //Borrar ListItems
        await this.listItemsRepository.createQueryBuilder().delete().where({}).execute();

        //Borrar Listas
        await this.listsRepository.createQueryBuilder().delete().where({}).execute();

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

    async loadLists(user: User): Promise<List> { 
        const lists = [];
        for (const list of SEED_LISTS) {
            lists.push( this.listsService.create(list, user) );
        }
        return lists[0];
    }

    async loadListItems(list: List, items: Item[]) {
        
        for (const item of items) {
            this.listItemsService.create({
                quantity: Math.round( Math.random() * 10 ),
                completed: Math.round( Math.random() * 1 ) === 0 ? false : true,
                listId: list.id,
                itemId: item.id
            })
        }
    }
}

