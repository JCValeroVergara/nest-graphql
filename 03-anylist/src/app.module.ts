import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ItemsModule } from './items/items.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';



@Module({
    imports: [

        ConfigModule.forRoot(),

        //* Configuración de GraphQL con Apollo asycn
        // GraphQLModule.forRootAsync({
        //     driver: ApolloDriver,
        //     imports: [ AuthModule],
        //     inject: [JwtService],
        //     useFactory: async(jwtService: JwtService) => ({
        //         autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        //         playground: false,
        //         plugins: [
        //             ApolloServerPluginLandingPageLocalDefault(),
        //         ],
        //         context({ req }) {
        //             const token = req.headers.authorization?.replace('Bearer ', '');
        //             if (!token) throw new Error('No token provided');
                    
        //             const payload = jwtService.decode(token);
        //             if (!payload) throw new Error('Invalid token');

        //         },
        //     })
        // }),


        //* Configuración de GraphQL Basica
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            playground: false,
            plugins: [
                ApolloServerPluginLandingPageLocalDefault(),
            ]
        }),

        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            synchronize: true,
            autoLoadEntities: true,
        }),
        ItemsModule,
        UsersModule,
        AuthModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
