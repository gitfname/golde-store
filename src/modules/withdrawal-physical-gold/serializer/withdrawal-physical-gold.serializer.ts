
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { EWithdrawalPhysicalGoldStatus } from "../withdrawal-physical-gold.enum";
import { Expose, Type } from "class-transformer";
import { UsersSerializer } from "src/common/users/dto";
import { BankAccountsSerializer } from "src/modules/bank-accounts/serializer";

export class WithdrawalPhysicalGoldSerializer {
    @ApiProperty({ name: "id", type: Number })
    @Expose()
    id: number;

    @ApiProperty({ name: "goldAmount", type: Number })
    @Expose()
    goldAmount: number;

    @ApiProperty({ name: "user", type: UsersSerializer })
    @Expose()
    @Type(() => UsersSerializer)
    user: UsersSerializer;

    @ApiProperty({ name: "bankAccount", type: BankAccountsSerializer })
    @Expose()
    @Type(() => BankAccountsSerializer)
    bankAccount: BankAccountsSerializer;

    @ApiProperty({ name: "status", enum: EWithdrawalPhysicalGoldStatus })
    @Expose()
    status: EWithdrawalPhysicalGoldStatus;

    @ApiPropertyOptional({ name: "description", type: String })
    @Expose()
    description?: string;

    @ApiPropertyOptional({ name: "createdAt", type: Date })
    @Expose()
    createdAt: Date;

    @ApiPropertyOptional({ name: "updatedAt", type: Date })
    @Expose()
    updatedAt: Date;
}