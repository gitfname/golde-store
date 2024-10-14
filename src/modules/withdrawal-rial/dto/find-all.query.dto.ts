import { IsEnum, IsInt, IsOptional, Max, Min } from "class-validator";
import { EWithdrawalRialStatus } from "../withdrawal-rial.enum";
import { Transform } from "class-transformer";

export class FindAllQueryDto {
    @IsOptional()
    @IsInt()
    @Max(999_999)
    @Min(1)
    @Transform(params => +params.value)
    userId?: number;

    @IsOptional()
    @IsEnum(EWithdrawalRialStatus)
    status?: EWithdrawalRialStatus;
}