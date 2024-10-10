import { IsString, MaxLength, MinLength } from "class-validator"

export class LoginDto {
    @IsString()
    @MaxLength(11)
    @MinLength(11)
    phone: string;
}