import { IsString, IsNotEmpty } from 'class-validator';

export class RegisterCompanyDto {
    @IsString()
    @IsNotEmpty()
    token: string;

    @IsString()
    @IsNotEmpty()
    subdomain: string;
}