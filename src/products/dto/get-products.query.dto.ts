import {IsInt, IsOptional, Max, Min} from "class-validator";
import {Type} from "class-transformer";

export class GetProductsQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;


    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(20)
    size?: number = 10;
}
