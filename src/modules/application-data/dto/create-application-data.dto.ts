import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsInt, Min, Max } from "class-validator"

export class CreateApplicationDataDto {
    @ApiProperty({ name: "rialToGoldConversionRate", type: Number })
    @IsInt()
    @Max(9_999_999_999)
    @Min(1000)
    @Transform(params => +params.value)
    rialToGoldConversionRate: number;
}