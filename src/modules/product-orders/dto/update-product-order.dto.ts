import { IsEnum, IsOptional, IsString, MaxLength } from "class-validator"
import { EProductOrdersStatus } from "../product-orders.enum";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateProductOrderDto {
    @ApiPropertyOptional({ name: "adminMessage", type: String })
    @IsOptional()
    @IsString()
    @MaxLength(750)
    adminMessage?: string;

    @ApiPropertyOptional({ name: "status", enum: EProductOrdersStatus })
    @IsEnum(EProductOrdersStatus)
    status: EProductOrdersStatus;
}