import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { HttpModule } from '@nestjs/axios';
import {PrismaService} from "../prisma/prisma.service";

@Module({
    imports: [HttpModule],
    controllers: [CompanyController],
    providers: [CompanyService, PrismaService],
})
export class CompanyModule {}