import { IsEnum, IsInt, IsOptional, Max, Min } from "class-validator";
import { ETransactionStatus } from "../transactions.enum";
import { Transform } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class FindAllQueryDto {
    @ApiPropertyOptional({ name: "userId", type: Number })
    @IsOptional()
    @IsInt()
    @Max(999_999)
    @Min(1)
    @Transform((params) => +params.value)
    userId?: number;

    @IsOptional()
    @IsEnum(ETransactionStatus)
    @ApiPropertyOptional({ name: "status", enum: ETransactionStatus })
    status?: ETransactionStatus;
}