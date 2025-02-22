import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { JwtStrategy } from './strategies';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from 'src/users/users.module';

@Module({
    providers: [AuthResolver, AuthService, JwtStrategy],
    exports: [ JwtStrategy, PassportModule, JwtModule],
    imports: [
        
        ConfigModule,
        
        PassportModule.register({ defaultStrategy: 'jwt' }),

        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: '4H' },
            }),
        }),

        UsersModule
    ],
})
export class AuthModule {}
