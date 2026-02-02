import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface JwtPayload {
    userId: number;
    role: string;
}

export const CurrentUser = createParamDecorator(
    (property: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<{ user?: JwtPayload }>();
        const user = request.user;

        if (!user) return null;

        return property ? user[property] : user;
    },
);