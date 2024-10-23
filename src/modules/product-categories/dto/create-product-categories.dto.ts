import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength } from "class-validator"

export class CreateProductCategoryDto {
    @ApiProperty({ name: "title", type: String })
    @IsString()
    @MaxLength(255)
    title: string;
}