import { ApiPropertyOptional } from "@nestjs/swagger";
import { Paging } from "@ptc-org/nestjs-query-core";
import { Transform } from "class-transformer";
import { IsInt, IsOptional, Max, Min } from "class-validator";

export class PagingDto implements Paging {
    @ApiPropertyOptional({ name: "limit", type: Number })
    @IsOptional()
    @Transform(params => isNaN(+params.value) ? 10 : +params.value)
    @IsInt()
    @Max(30)
    @Min(0)
    limit?: number = 10;

    @ApiPropertyOptional({ name: "offset", type: Number })
    @IsOptional()
    @Transform(params => isNaN(+params.value) ? 0 : +params.value)
    @IsInt()
    @Max(30)
    @Min(0)
    offset?: number = 0;
}