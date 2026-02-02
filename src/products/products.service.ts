import {
    Injectable,
    ForbiddenException,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Role } from '@prisma/client';
import {ConfigService} from "@nestjs/config";
import {ERROR_MESSAGES} from "../common/constants/constant";
import {OxVariationsResponse} from "../types/products.types";



@Injectable()
export class ProductsService {
    private readonly subdomain: string;
    private readonly token: string;

    constructor(
        private readonly prisma: PrismaService,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) {
        this.subdomain = this.configService.getOrThrow<string>("OX_SUBDOMAIN");
        this.token = this.configService.getOrThrow<string>("OX_TOKEN");
    }

    async getProducts(
        userId: number,
        page: number,
        size: number,
    ): Promise<OxVariationsResponse> {

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { company: true },
        });

        if (!user) {
            throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
        }

        if (user.role !== Role.MANAGER) {
            throw new ForbiddenException(ERROR_MESSAGES.ONLY_MANAGERS_ACCESS_PRODUCTS);
        }

        if (!user.company) {
            throw new ForbiddenException(ERROR_MESSAGES.USER_NOT_ASSIGNED_TO_COMPANY);
        }


        const response = await firstValueFrom(
            this.httpService.get<OxVariationsResponse>(
                `https://${this.subdomain}.ox-sys.com/variations`,
                {
                    params: { page, size },
                    headers: {
                        Accept: 'application/json',
                        Authorization: this.token,
                    },
                },
            ),
        );

        return response.data;
    }
}