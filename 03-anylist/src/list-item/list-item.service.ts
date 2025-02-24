import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateListItemInput, UpdateListItemInput } from './dto';
import { PaginationArgs, SearchArgs } from 'src/common/dto';

import { List } from 'src/lists/entities';
import { ListItem } from './entities';


@Injectable()
export class ListItemService {

    constructor(
        @InjectRepository(ListItem)
        private readonly listItemRepository:Repository<ListItem>,
    ) {}

    async create(createListItemInput: CreateListItemInput): Promise<ListItem> {

        const { itemId, listId, ...rest} = createListItemInput;
        
        const newListItem = this.listItemRepository.create({
            ...rest,
            item: { id: itemId },
            list: { id: listId }
        });

        await this.listItemRepository.save(newListItem);

        return this.findOne(newListItem.id);
    }

    async findAll( list: List, paginationArgs: PaginationArgs, searchArgs: SearchArgs ): Promise<ListItem[]> {
        
        const { offset, limit } = paginationArgs;
        const { search } = searchArgs;

        const queryBuilder = this.listItemRepository.createQueryBuilder()
            .take(limit)
            .skip(offset)
            .where(`"listId" = :listId`, { listId: list.id });
        
        if (search) {
            queryBuilder.andWhere(`LOWER(name) like :name`, { name: `%${search.toLowerCase()}%` });
        }
        
        return queryBuilder.getMany();
    }

    async counteListItemsByList( list: List ): Promise<number> {
        return this.listItemRepository.count({ where: { list: { id: list.id } } });
    }

    async findOne(id: string): Promise<ListItem> {
        const listItem = await this.listItemRepository.findOneBy({ id });
        if (!listItem) throw new NotFoundException(`ListItem with id ${id} not found`);
        return listItem;
    }

    async update(
        id: string, updateListItemInput: UpdateListItemInput
    ): Promise<ListItem> {

        const { itemId, listId, ...rest} = updateListItemInput;

        const queryBuilder = this.listItemRepository.createQueryBuilder()
            .update()
            .set(rest)
            .where(`id = :id`, { id });
        
        if (listId) queryBuilder.set({ list: { id: listId } });
        if (itemId) queryBuilder.set({ item: { id: itemId } });

        await queryBuilder.execute();
        return this.findOne(id);
    }

    remove(id: number) {
        return `This action removes a #${id} listItem`;
    }
}
