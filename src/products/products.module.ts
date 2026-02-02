import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    imports: [
        HttpModule,
        ConfigModule,
    ],
    controllers: [ProductsController],
    providers: [ProductsService, PrismaService],
})
export class ProductsModule {}