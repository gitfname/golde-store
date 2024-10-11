import { IsBoolean, IsDecimal, IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator"
import { Transform } from "class-transformer";
import { IsFile, HasMimeType, MaxFileSize, MinFileSize, MemoryStoredFile } from "nestjs-form-data"
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateProductDto {
    @ApiPropertyOptional({ name: "title", type: String })
    @IsOptional()
    @IsString()
    @MaxLength(300)
    title: string;

    @ApiPropertyOptional({ name: "description", type: String })
    @IsOptional()
    @IsString()
    @MaxLength(600)
    description: string;

    @ApiPropertyOptional({ name: "amountOfGoldUsed", type: Number })
    @IsOptional()
    @IsDecimal()
    @Transform(params => parseFloat(params.value))
    amountOfGoldUsed: number;

    @ApiPropertyOptional({ name: "fee", type: Number })
    @IsOptional()
    @IsInt()
    @Max(99)
    @Min(0)
    @Transform(params => +params.value)
    fee: number;

    @ApiPropertyOptional({ name: "thumbnailImage", type: "string", format: "binary" })
    @IsOptional()
    @IsFile()
    @HasMimeType(["image/jpeg", "image/jpg", "image/png"])
    @MinFileSize(5000)
    @MaxFileSize(930000)
    thumbnailImage: MemoryStoredFile;

    @ApiPropertyOptional({ name: "coverImage", type: "string", format: "binary" })
    @IsOptional()
    @IsFile()
    @HasMimeType(["image/jpeg", "image/jpg", "image/png"])
    @MinFileSize(6000)
    @MaxFileSize(1900000)
    coverImage: MemoryStoredFile;

    @ApiPropertyOptional({ name: "price", type: Number })
    @IsOptional()
    @IsDecimal()
    @Transform(params => parseFloat(params.value))
    price: number;

    @ApiPropertyOptional({ name: "isActive", type: Boolean })
    @IsOptional()
    @IsBoolean()
    @Transform(params => (params.value + "").toLowerCase() === "true")
    isActive: boolean;

    @ApiPropertyOptional({ name: "isAvailable", type: Boolean })
    @IsOptional()
    @IsBoolean()
    @Transform(params => (params.value + "").toLowerCase() === "true")
    isAvailable: boolean;
}
