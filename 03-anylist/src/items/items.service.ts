import { Injectable, NotFoundException } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateItemInput, UpdateItemInput } from './dto';
import { PaginationArgs, SearchArgs } from 'src/common/dto';
import { Item } from './entities';
import { User } from 'src/users/entities';

@Injectable()
export class ItemsService {

    constructor(
        @InjectRepository(Item)
        private readonly itemsRepository: Repository<Item>
    ) {}


    async create(createItemInput: CreateItemInput, user:User): Promise<Item> {
        const newItem = this.itemsRepository.create({...createItemInput, user});
        return this.itemsRepository.save(newItem);
    }

    async findAll( user: User, paginationArgs: PaginationArgs, searchArgs: SearchArgs ): Promise<Item[]> {
        const { offset, limit } = paginationArgs;
        const { search } = searchArgs;

        const queryBuilder = this.itemsRepository.createQueryBuilder()
            .take(limit)
            .skip(offset)
            .where(`"userId" = :userId`, { userId: user.id });
        
        if (search) {
            queryBuilder.andWhere(`LOWER(name) like :name`, { name: `%${search.toLowerCase()}%` });
        }
        
        return queryBuilder.getMany();
        // return this.itemsRepository.find({ where: { user: { id: user.id }, name: Like(`%${search}%`) }, skip: offset, take: limit });
    }

    async findOne(id: string, user: User): Promise<Item> {
        const item = await this.itemsRepository.findOneBy({ id, user: { id: user.id } });
        if (!item) throw new NotFoundException(`Item #${id} not found`);
        return item;
    }

    async update(id: string, updateItemInput: UpdateItemInput, user: User): Promise<Item> {
        await this.findOne(id, user);
        const item = await this.itemsRepository.preload( updateItemInput );
        if (!item) throw new NotFoundException(`Item #${id} not found`);
        return this.itemsRepository.save(item);
    }

    async remove(id: string, user: User): Promise<Item> {
        const item = await this.findOne(id, user);
        await this.itemsRepository.remove(item);

        return { ...item, id };
    }

    async itemCountByUser(user: User): Promise<number> {
        return this.itemsRepository.count({ where: { user: { id: user.id } } });
    }
}
