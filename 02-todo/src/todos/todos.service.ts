import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './entities';
import { CreateTodoInput, StatusArgs, UpdateTodoInput } from './dtos';

@Injectable()
export class TodosService {

    private todos: Todo[] = [
        { id: 1, description: 'Todo 1', done: false },
        { id: 2, description: 'Todo 2', done: true },
        { id: 3, description: 'Todo 3', done: false },
        { id: 4, description: 'Todo 4', done: false },
        { id: 5, description: 'Todo 5', done: true },
    ];

    get totalTodos(): number {
        return this.todos.length;
    }

    get completedTodos(): number {
        return this.todos.filter(todo => todo.done).length;
    }

    get pendingTodos(): number {
        return this.todos.filter(todo => !todo.done).length;
    }

    findAll(statusArgs: StatusArgs): Todo[] {
        
        const { status } = statusArgs;
        if(status !== undefined) return this.todos.filter(todo => todo.done === status);

        return this.todos;
    }

    findOne(id: number): Todo {
        const todo = this.todos.find(todo => todo.id === id);
        if (!todo) throw new NotFoundException(`Todo with id ${id} not found`);
        return todo;
    }

    create(createTodoInput: CreateTodoInput): Todo{
        
        const todo = new Todo();
        todo.description = createTodoInput.description;
        todo.id = Math.max(...this.todos.map(todo => todo.id), 0) + 1;
        
        this.todos.push(todo);
        return todo;
    }

    update(id:number, updateTodoInput: UpdateTodoInput): Todo { 
        const { description, done } = updateTodoInput;
        
        const todoToUpdate = this.findOne(id);

        if (description) todoToUpdate.description = description;
        if (done !== undefined) todoToUpdate.done = done;

        this.todos = this.todos.map(todo => {
            return (todo.id === id) ? todoToUpdate : todo;
        });

        return todoToUpdate;
    }

    remove(id: number): Boolean {
        const todoToRemove = this.findOne(id);
        this.todos = this.todos.filter(todo => todo.id !== todoToRemove.id);
        return true;
    }

}
