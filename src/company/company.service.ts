import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { HttpService } from '@nestjs/axios';
import {PrismaService} from "../prisma/prisma.service";
import {ERROR_MESSAGES} from "../common/constants/constant";
import {Role} from "@prisma/client";

@Injectable()
export class CompanyService {
    constructor(
        private prisma: PrismaService,
        private httpService: HttpService,
    ) {}

    async registerCompany(userId: number, registerCompanyDto: RegisterCompanyDto) {
        const oxUrl = `https://${registerCompanyDto.subdomain}.ox-sys.com/profile`;
        try {
            await this.httpService.get(oxUrl, {
                headers: {
                    Accept: 'application/json',
                    Authorization: registerCompanyDto.token,
                },
            }).toPromise();
        } catch (error) {
            throw new BadRequestException(ERROR_MESSAGES.INVALID_TOKEN);
        }

        let company = await this.prisma.company.findUnique({ where: { subdomain: registerCompanyDto.subdomain } });
        if (company) {
            await this.prisma.user.update({
                where: { id: userId },
                data: { companyId: company.id, role: Role.MANAGER },
            });
            return { message: 'Assigned as manager' };
        } else {
            company = await this.prisma.company.create({
                data: {
                    subdomain: registerCompanyDto.subdomain,
                    token: registerCompanyDto.token,
                },
            });
            await this.prisma.user.update({
                where: { id: userId },
                data: { companyId: company.id, role: Role.ADMIN },
            });
            return { message: 'Company created and assigned as admin' };
        }
    }

    async deleteCompany(id: number, userId: number) {
        const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { company: true } });
        if (!user || user.role !== Role.ADMIN || user.companyId !== id) {
            throw new ForbiddenException(ERROR_MESSAGES.UNAUTHORIZED);
        }
        await this.prisma.company.delete({ where: { id } });
        return { message: 'Company deleted' };
    }
}