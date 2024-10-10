import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength } from "class-validator"

export class CreateBankAccountDto {
    @ApiProperty({ name: "shabaNumber", type: String })
    @IsString()
    @MaxLength(200)
    shabaNumber: string;
}