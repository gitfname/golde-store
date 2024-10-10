import { IsEnum, IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator"
import { ETransactionStatus } from "../transactions.enum";
import { Transform } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateTransactionDto {
    @IsOptional()
    @IsString()
    @MaxLength(650)
    @ApiPropertyOptional({ name: "adminsMessage", type: String })
    adminsMessage?: string;

    @IsEnum(ETransactionStatus)
    @ApiPropertyOptional({ name: "status", enum: ETransactionStatus })
    status: ETransactionStatus;

    @IsOptional()
    @IsInt()
    @Max(99_999_999)
    @Min(50_000)
    @Transform(params => +params.value)
    @ApiPropertyOptional({ name: "increaseRialAmount", type: Number })
    increaseRialAmount: number;

    @IsOptional()
    @IsInt()
    @Max(2000)
    @Min(1)
    @Transform(params => +params.value)
    @ApiPropertyOptional({ name: "increaseGoldAmount", type: Number })
    increaseGoldAmount: number;
}