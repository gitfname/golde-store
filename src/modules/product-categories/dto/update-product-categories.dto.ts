import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator"

export class UpdateProductCategoryDto {
    @ApiPropertyOptional({ name: "title", type: String })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    title: string;
}