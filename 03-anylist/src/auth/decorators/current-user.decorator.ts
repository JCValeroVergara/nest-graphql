import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';


export const CurrentUser = createParamDecorator(
    (roles = [], context: ExecutionContext) => {
        
        const ctx = GqlExecutionContext.create(context);
        const user = ctx.getContext().req.user;

        if( !user){
            throw new InternalServerErrorException(`No user found in request context - make sure that we used the AuthGuard`);
        }

        return user;
    }
);