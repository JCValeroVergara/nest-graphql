import { Args, Float, Int, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class HelloWorldResolver {

    @Query(() => String, { description: 'Saluda al mundo', name: 'hello' })
    helloWorld(): string {
        return 'Hola Mundo!';
    }

    @Query(() => Float, { name: 'randomNumber' })
    getRandomNumber(): number {
        return Math.random()*100;
    }

    //resolver para un random number entero entre 0 y 10
    @Query(() => Int, { name: 'randomFromZeroTo', description: 'Genera un número aleatorio entre 0 y el número pasado como argumento' })
    getRandomFromZeroTo(@Args('to', {type: ()=>Int}) to: number): number {
        return Math.floor(Math.random()* to);
    }
}
