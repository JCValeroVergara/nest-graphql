import { Injectable } from '@nestjs/common';
import { CreateListItemInput, UpdateListItemInput } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ListItem } from './entities';
import { Repository } from 'typeorm';


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

        return await this.listItemRepository.save(newListItem);
    }

    async findAll(): Promise<ListItem[]> {
        return this.listItemRepository.find();
    }

    findOne(id: number) {
        return `This action returns a #${id} listItem`;
    }

    update(id: number, updateListItemInput: UpdateListItemInput) {
        return `This action updates a #${id} listItem`;
    }

    remove(id: number) {
        return `This action removes a #${id} listItem`;
    }
}
