import {
    Body,
    Controller,
    Delete,
    Param, ParseIntPipe,
    Post,
    UseGuards,
} from '@nestjs/common';

import { CompanyService } from './company.service';
import { RegisterCompanyDto } from './dto/register-company.dto';
import {AdminOnly} from "../auth/decorators/roles.decorator";
import {RolesGuard} from "../auth/guard/roles.guard";
import {CurrentUser} from "../auth/decorators/current-user.decorator";

@Controller('company')
@UseGuards(RolesGuard)
export class CompanyController {
    constructor(private readonly companyService: CompanyService) {}

    @Post('register-company')
    async registerCompany(
        @CurrentUser('userId') userId: number,
        @Body() dto: RegisterCompanyDto,
    ) {
        return this.companyService.registerCompany(userId, dto);
    }

    @Delete(':id')
    @AdminOnly()
    async deleteCompany(
        @Param('id', ParseIntPipe) companyId: number,
        @CurrentUser('userId') userId: number,
    ) {
        return this.companyService.deleteCompany(companyId, userId);
    }
}
