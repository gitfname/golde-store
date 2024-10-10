
import { IsString, MaxLength, IsEnum, IsOptional } from "class-validator"
import { ENationalCardRejectionReason, ENationalCardStatus } from "../national-cards.enum";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateNationalCardDto {
    @ApiPropertyOptional({ name: "adminMessage", type: String })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    adminMessage?: string;

    @ApiPropertyOptional({ name: "status", enum: ENationalCardStatus })
    @IsEnum(ENationalCardStatus)
    status: ENationalCardStatus;

    @ApiPropertyOptional({ name: "rejectionReason", enum: ENationalCardRejectionReason })
    @IsOptional()
    @IsEnum(ENationalCardRejectionReason)
    rejectionReason?: ENationalCardRejectionReason;
}