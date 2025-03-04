import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


import { CreateListInput } from './dto/inputs/create-list.input';
import { UpdateListInput } from './dto/inputs/update-list.input';
import { List } from './entities';
import { User } from 'src/users/entities';
import { PaginationArgs, SearchArgs } from 'src/common/dto';

@Injectable()
export class ListsService {
    constructor(
        @InjectRepository(List)
        private readonly listRepository: Repository<List>
    ) {}


    async create(createListInput: CreateListInput, user: User): Promise<List> {
        const newList = this.listRepository.create({...createListInput, user});
        return await this.listRepository.save(newList);
    }

    async findAll(user: User, paginationArgs: PaginationArgs, searchArgs: SearchArgs): Promise<List[]> {
        
        const { limit, offset } = paginationArgs;
        const { search } = searchArgs;

        const queryBuilder = this.listRepository.createQueryBuilder('list')
            .take(limit)
            .skip(offset)
            .where('list.userId = :userId', { userId: user.id });
        
        if (search) {
            queryBuilder.andWhere(`LOWER(name) like :name`, { name: `%${search.toLowerCase()}%` });
        }
        return await queryBuilder.getMany();
    }

    async findOne(id: string, user: User): Promise<List> {
        const list = await this.listRepository.findOneBy({ id, user: { id: user.id } });
        if (!list) throw new NotFoundException(`List #${id} not found`);
        return list;
    }

    async update(id: string, updateListInput: UpdateListInput, user: User): Promise<List> {
        await this.findOne(id, user);
        const list = await this.listRepository.preload({ ...updateListInput, user });
        if (!list) throw new NotFoundException(`List #${id} not found`);
        return this.listRepository.save(list);
    }

    async remove(id: string, user: User): Promise<List> {
        const list = await this.findOne(id, user);
        await this.listRepository.remove(list);

        return { ...list, id };
    }

    async listsCountByUser(user: User): Promise<number> {
        return this.listRepository.count({ where: { user: { id: user.id } } });
    }
}
