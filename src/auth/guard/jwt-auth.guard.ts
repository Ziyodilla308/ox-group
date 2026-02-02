import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    private publicKey: string;

    constructor(
        private reflector: Reflector,
        private configService: ConfigService,
    ) {
        this.publicKey = this.configService.get<string>('JWT_SECRET') || '';
    }

    canActivate(context: ExecutionContext): boolean {
        const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) return true;

        const request = context.switchToHttp().getRequest<Request>();
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('No Bearer token provided');
        }

        const token = authHeader.replace('Bearer ', '').trim();

        if (!this.publicKey) {
            throw new UnauthorizedException('JWT public key not configured');
        }

        try {
            const payload = jwt.verify(token, this.publicKey, {
                algorithms: ['RS256'],
            }) as jwt.JwtPayload;

            if (payload.exp && payload.exp < Date.now() / 1000) {
                throw new UnauthorizedException('Token has expired');
            }

            request['user'] = payload;
            return true;
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                throw new UnauthorizedException('Token has expired');
            } else if (err instanceof jwt.JsonWebTokenError) {
                throw new UnauthorizedException('Invalid token');
            } else {
                throw new UnauthorizedException('Invalid or expired token');
            }
        }
    }
}