import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './company/company.module';
import {PrismaService} from "./prisma/prisma.service";
import {ProductsModule} from "./products/products.module";
import {ConfigModule} from "@nestjs/config";
import {APP_GUARD} from "@nestjs/core";
import {JwtAuthGuard} from "./auth/guard/jwt-auth.guard";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),  AuthModule, CompanyModule, ProductsModule],
  providers: [PrismaService, {
    provide: APP_GUARD,
    useClass: JwtAuthGuard
  }],
})
export class AppModule {}