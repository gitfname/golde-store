
import { IsString, MaxLength, IsEnum, IsOptional } from "class-validator"
import { EWithdrawalPhysicalGoldStatus } from "../withdrawal-physical-gold.enum";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateWithdrawalPhysicalGoldDto {
    @ApiPropertyOptional({ name: "status", enum: EWithdrawalPhysicalGoldStatus })
    @IsEnum(EWithdrawalPhysicalGoldStatus)
    status: EWithdrawalPhysicalGoldStatus;

    @ApiPropertyOptional({ name: "description", type: String })
    @IsOptional()
    @IsString()
    @MaxLength(650)
    description?: string;
}