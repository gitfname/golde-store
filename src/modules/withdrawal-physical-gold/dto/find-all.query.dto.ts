
import { IsInt, Max, Min, IsEnum, IsOptional } from "class-validator"
import { EWithdrawalPhysicalGoldStatus } from "../withdrawal-physical-gold.enum";
import { Transform } from "class-transformer";

export class FindAllQueryDto {
    @IsOptional()
    @IsInt()
    @Max(999_999)
    @Min(1)
    @Transform(params => +params.value)
    userId?: number;

    @IsOptional()
    @IsEnum(EWithdrawalPhysicalGoldStatus)
    status?: EWithdrawalPhysicalGoldStatus;
}