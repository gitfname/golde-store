
import { IsOptional, IsEnum, IsString, MaxLength } from "class-validator"
import { EWithdrawalRialStatus } from "../withdrawal-rial.enum";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateWithdrawalRialDto {
    @ApiProperty({ name: "status", enum: EWithdrawalRialStatus })
    @IsEnum(EWithdrawalRialStatus)
    status: EWithdrawalRialStatus;

    @ApiPropertyOptional({ name: "description", type: String })
    @IsOptional()
    @IsString()
    @MaxLength(650)
    description?: string;
}