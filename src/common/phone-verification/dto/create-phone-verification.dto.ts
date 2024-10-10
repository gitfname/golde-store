import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength } from "class-validator"

export class CreatePhoneVerificationDto {
    @ApiProperty({ name: "phone", type: String })
    @IsString()
    @MaxLength(11)
    phone: string;
}