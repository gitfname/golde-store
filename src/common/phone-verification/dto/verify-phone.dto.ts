import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator"

export class VerifyPhoneDto {
    @ApiProperty({ name: "phone", type: String })
    @IsString()
    @MaxLength(11)
    @MinLength(11)
    phone: string;

    @ApiProperty({ name: "code", type: String })
    @IsString()
    @MaxLength(5)
    @MinLength(5)
    code: string;
}