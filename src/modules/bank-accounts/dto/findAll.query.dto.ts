import { IsOptional, IsInt, Max, Min } from "class-validator"
import { Transform } from "class-transformer"
import { ApiPropertyOptional } from "@nestjs/swagger";

export class FindAllQueryDto {
    @ApiPropertyOptional({ name: "userId", type: Number })
    @IsOptional()
    @IsInt()
    @Max(999_999)
    @Min(1)
    @Transform(params => isNaN(+params.value) ? null : +params.value)
    userId?: number;
}