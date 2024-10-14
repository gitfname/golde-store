
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsInt, Max, Min, IsNumber } from "class-validator"

export class CreateWithdrawalPhysicalGoldDto {
    @ApiProperty({ name: "bankAccount", type: Number })
    @IsInt()
    @Max(999_999)
    @Min(1)
    @Transform(params => +params.value)
    bankAccount: number;

    @ApiProperty({ name: "goldAmount", type: Number })
    @IsNumber({ maxDecimalPlaces: 4 })
    @Max(950)
    @Min(25)
    @Transform(params => parseFloat(params.value))
    goldAmount: number;
}