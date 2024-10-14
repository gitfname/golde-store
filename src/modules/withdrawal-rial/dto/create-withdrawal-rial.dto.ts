import { IsInt, Max, Min } from "class-validator"
import { Transform } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger";

export class CreateWithdrawalRialDto {
    @ApiProperty({ name: "bankAccount", type: Number })
    @IsInt()
    @Max(999_999)
    @Min(1)
    @Transform(params => +params.value)
    bankAccount: number;

    @ApiProperty({ name: "withdrawalAmount", type: Number })
    @IsInt()
    @Max(75_000_000)
    @Min(1000_000)
    @Transform(params => +params.value)
    withdrawalAmount: number;
}