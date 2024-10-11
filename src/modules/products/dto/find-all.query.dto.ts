import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

export class FindAllQueryDto {
    // @ApiPropertyOptional({ name: "title", type: String })
    @IsOptional()
    @IsString()
    @MaxLength(300)
    title: string;

    // @ApiPropertyOptional({ name: "isActive", type: Boolean })
    @IsOptional()
    @IsBoolean()
    @Transform(params => (params.value + "").toLowerCase() === "true")
    isActive: boolean;

    // @ApiPropertyOptional({ name: "isAvailable", type: Boolean })
    @IsOptional()
    @IsBoolean()
    @Transform(params => (params.value + "").toLowerCase() === "true")
    isAvailable: boolean;

    // @ApiPropertyOptional({ name: "minPrice", type: Number })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 4 })
    @Transform(params => parseFloat(params.value))
    minPrice: number;

    // @ApiPropertyOptional({ name: "maxPrice", type: Number })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 4 })
    @Transform(params => parseFloat(params.value))
    maxPrice: number;

    // @ApiPropertyOptional({ name: "minUsedGoldGrams", type: Number })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 4 })
    @Transform(params => parseFloat(params.value))
    minUsedGoldGrams: number;

    // @ApiPropertyOptional({ name: "maxUsedGoldGrams", type: Number })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 4 })
    @Transform(params => parseFloat(params.value))
    maxUsedGoldGrams: number;

    // @ApiPropertyOptional({ name: "minFee", type: Number })
    @IsOptional()
    @IsInt()
    @Max(99)
    @Min(0)
    @Transform(params => parseInt(params.value))
    minFee: number;

    // @ApiPropertyOptional({ name: "maxFee", type: Number })
    @IsOptional()
    @IsInt()
    @Max(99)
    @Min(0)
    @Transform(params => parseInt(params.value))
    maxFee: number;
}