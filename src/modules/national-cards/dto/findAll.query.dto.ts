import { IsInt, Max, Min, IsEnum, IsOptional } from "class-validator"
import { Transform } from "class-transformer"
import { ENationalCardStatus } from "../national-cards.enum";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class FindAllQueryDto {
    @ApiPropertyOptional({ name: "userId", type: Number })
    @IsOptional()
    @IsInt()
    @Max(999_999)
    @Min(1)
    @Transform(params => +params.value)
    userId?: number;

    @ApiPropertyOptional({ name: "status", enum: ENationalCardStatus })
    @IsOptional()
    @IsEnum(ENationalCardStatus)
    status?: ENationalCardStatus;
}