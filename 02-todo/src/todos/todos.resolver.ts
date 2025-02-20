import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Todo } from './entities';
import { TodosService } from './todos.service';
import { CreateTodoInput, StatusArgs, UpdateTodoInput } from './dtos';
import { AgregationsType } from './types';

@Resolver( () => Todo)
export class TodosResolver {

    constructor(
        private readonly todosService: TodosService,
    ) {}

    @Query(() => [Todo], { name: 'todos' })
    findAll(
        @Args() statusArgs: StatusArgs,
    ): Todo[] {
        return this.todosService.findAll( statusArgs);
    }

    @Query(() => Todo, { name: 'todo' })
    findOne(
        @Args('id', { type: ()=>Int}) id: number,
    ): Todo {
        return this.todosService.findOne(id);
    }

    @Mutation(() => Todo, { name: 'createTodo' })
    create(
        @Args('creteTodoInput') createTodoInput: CreateTodoInput,
    ) {
        return this.todosService.create(createTodoInput);
    }

    @Mutation(() => Todo, { name: 'updateTodo' })
    update(
        @Args('updateTodoInput') updateTodoInput: UpdateTodoInput,
    ) {
        return this.todosService.update(updateTodoInput.id, updateTodoInput);
    }

    @Mutation(()=> Boolean, { name: 'removeTodo' })
    remove(
        @Args('id', { type: ()=>Int }) id: number,
    ) {
        return this.todosService.remove(id);
    }

    //Agregations
    @Query(() => Int, { name: 'totalTodos' })
    totalTodos(): number {
        return this.todosService.totalTodos;
    }

    @Query(() => Int, { name: 'completedTodos' })
    completedTodos(): number {
        return this.todosService.completedTodos;
    }

    @Query(() => Int, { name: 'pendingTodos' })
    pendingTodos(): number {
        return this.todosService.pendingTodos;
    }

    @Query(() => AgregationsType)
    agregations(): AgregationsType {
        return {
            total: this.todosService.totalTodos,
            completed: this.todosService.completedTodos,
            pending: this.todosService.pendingTodos,
        };
    }

}
