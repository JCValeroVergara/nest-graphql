import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodoService {

    private todos: Todo[] = [
        { id: 1, description: 'Learn NestJS', done: false },
        { id: 2, description: 'Learn TypeScript', done: false },
        { id: 3, description: 'Learn JavaScript', done: false },
    ];

    create(createTodoDto: CreateTodoDto): Todo {
        
        const todo = new Todo();
        todo.id = Math.max(...this.todos.map(todo => todo.id),0) + 1;
        todo.description = createTodoDto.description;
        
        this.todos.push(todo);
        return todo;
        
    }

    findAll(): Todo[] {
        return this.todos;
    }

    findOne(id: number): Todo {
        const todo = this.todos.find(todo => todo.id === id);
        if(!todo) throw new NotFoundException(`Todo with id ${id} not found`);
        return todo;
    }

    update(id: number, updateTodoDto: UpdateTodoDto): Todo {
        const todo = this.findOne(id);
        
        const { description, done } = updateTodoDto;
        if (done !== undefined) todo.done = done;
        if (description) todo.description = description;

        this.todos = this.todos.map(dbTodo => {
            if(dbTodo.id === id) return todo;
            return dbTodo;
        });

        return todo;
    }

    remove(id: number) {
        this.findOne(id);
        this.todos = this.todos.filter(todo => todo.id !== id);
        return { message:`Todo with id ${id} removed` };
    }
}
