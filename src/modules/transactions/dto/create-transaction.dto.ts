import { IsDecimal, IsEnum, IsInt, IsNumber, IsOptional, Max, Min, ValidateIf } from "class-validator"
import { IsFile, HasMimeType, MaxFileSize, MinFileSize, MemoryStoredFile } from "nestjs-form-data"
import { ETransactionType } from "../transactions.enum";
import { BadRequestException } from "@nestjs/common";
import { Transform } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class CreateTransactionDto {
    @ValidateIf((o) => o.transactionType === ETransactionType.ChargeWallet)
    @Transform(params => +params.value)
    @IsInt()
    @Max(999_999)
    @Min(1)
    @ApiPropertyOptional({ name: "bankAccount", type: Number })
    bankAccount?: number;

    @ValidateIf(o => {
        if (
            o.transactionType !== ETransactionType.ChargeWallet &&
            o.transactionType !== ETransactionType.RialToGold
        ) {
            return false
        }

        if (o.transactionType === ETransactionType.ChargeWallet) {
            if (o.amount) {
                throw new BadRequestException("amount should not exist in 'charge-wallet' type")
            }
            return false
        }

        return true
    })
    @Transform(params => +params.value)
    @IsInt()
    @Max(999_999_999)
    @Min(0.0001)
    @ApiPropertyOptional({ name: "amount", type: Number })
    amount?: number;

    @ValidateIf(o => {
        if (o.transactionType !== ETransactionType.GoldToRial) return false

        if (o.goldAmount && o.transactionType !== ETransactionType.GoldToRial) {
            throw new BadRequestException("amount should only exist in 'gold-to-rial' type")
        }

        return true
    })
    @Transform(params => parseFloat(params.value))
    @IsNumber({ maxDecimalPlaces: 4 })
    @Max(999_999_999)
    @Min(0.0001)
    @ApiPropertyOptional({ name: "goldAmount", type: Number })
    goldAmount?: number;

    @ValidateIf(o => {
        if (o.transactionType !== ETransactionType.ChargeWallet && o.transactionImage) {
            throw new BadRequestException(`transactionImage should not exist in '${o.transactionType}' type`)
        }
        return true
    })
    @ValidateIf((o) => o.transactionType === ETransactionType.ChargeWallet)
    @IsFile()
    @MaxFileSize(1782579)
    @MinFileSize(30720)
    @HasMimeType(["image/png", "image/jpeg", "image/jpg"])
    @ApiPropertyOptional({ name: "transactionImage", type: "string", format: "binary" })
    transactionImage?: MemoryStoredFile;

    @IsEnum(ETransactionType)
    @ApiPropertyOptional({ name: "transactionType", enum: ETransactionType })
    transactionType: ETransactionType;
}