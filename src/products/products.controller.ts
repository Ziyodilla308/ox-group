import {
    Controller,
    Get,
    Query,
    UseGuards,
    BadRequestException, Req,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import {ManagerOnly} from "../auth/decorators/roles.decorator";
import {RolesGuard} from "../auth/guard/roles.guard";
import {OxVariationsResponse} from "../types/products.types";

@Controller('products')
@UseGuards(RolesGuard)
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Get()
    @ManagerOnly()
    async getProduct(
        @Query('page') page = '1',
        @Query('size') size = '10',
        @Req() req,
    ): Promise<OxVariationsResponse> {
        const pageNumber = Number(page);
        const sizeNumber = Number(size);

        if (sizeNumber > 20) {
            throw new BadRequestException('size must not be greater than 20');
        }

        const userId = req.user.id;
        return this.productsService.getProducts(userId, pageNumber, sizeNumber);
    }


}