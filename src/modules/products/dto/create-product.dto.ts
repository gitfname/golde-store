import { IsBoolean, IsDecimal, IsInt, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from "class-validator"
import { Transform } from "class-transformer";
import { IsFile, HasMimeType, MaxFileSize, MinFileSize, MemoryStoredFile } from "nestjs-form-data"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateProductDto {
    @ApiProperty({ name: "title", type: String })
    @IsString()
    @MaxLength(300)
    title: string;

    @ApiPropertyOptional({ name: "description", type: String })
    @IsOptional()
    @IsString()
    @MaxLength(600)
    description: string;

    @ApiProperty({ name: "amountOfGoldUsed", type: Number })
    @IsNumber({ maxDecimalPlaces: 4 })
    @Transform(params => parseFloat(params.value))
    amountOfGoldUsed: number;

    @ApiProperty({ name: "fee", type: Number })
    @IsInt()
    @Max(99)
    @Min(0)
    @Transform(params => +params.value)
    fee: number;

    @ApiProperty({ name: "thumbnailImage", type: "string", format: "binary" })
    @IsFile()
    @HasMimeType(["image/jpeg", "image/jpg", "image/png"])
    @MinFileSize(5000)
    @MaxFileSize(930000)
    thumbnailImage: MemoryStoredFile;

    @ApiProperty({ name: "coverImage", type: "string", format: "binary" })
    @IsFile()
    @HasMimeType(["image/jpeg", "image/jpg", "image/png"])
    @MinFileSize(6000)
    @MaxFileSize(1900000)
    coverImage: MemoryStoredFile;

    @ApiProperty({ name: "price", type: Number })
    @IsNumber({ maxDecimalPlaces: 4 })
    @Transform(params => parseFloat(params.value))
    price: number;

    @ApiProperty({ name: "isActive", type: Boolean })
    @IsBoolean()
    @Transform(params => (params.value + "").toLowerCase() === "true")
    isActive: boolean;

    @ApiProperty({ name: "isAvailable", type: Boolean })
    @IsBoolean()
    @Transform(params => (params.value + "").toLowerCase() === "true")
    isAvailable: boolean;
}
