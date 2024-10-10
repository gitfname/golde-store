import { ApiProperty } from "@nestjs/swagger";
import { IsFile, MaxFileSize, HasMimeType, MemoryStoredFile } from "nestjs-form-data";

export class CreateNationalCardDto {
    @IsFile()
    @MaxFileSize(1_782_579)
    @HasMimeType(["image/jpeg", "image/jpg", "image/png", "image/webp"])
    @ApiProperty({ name: "frontImage", type: "string", format: "binary" })
    frontImage: MemoryStoredFile;

    @IsFile()
    @MaxFileSize(1_782_579)
    @HasMimeType(["image/jpeg", "image/jpg", "image/png", "image/webp"])
    @ApiProperty({ name: "backImage", type: "string", format: "binary" })
    backImage: MemoryStoredFile;
}