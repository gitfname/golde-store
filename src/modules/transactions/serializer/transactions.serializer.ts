import { Expose, Type } from "class-transformer"
import { ETransactionStatus, ETransactionType } from "../transactions.enum";
import { BankAccountsSerializer } from "src/modules/bank-accounts/serializer";
import { UsersSerializer } from "src/common/users/dto";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class TransactionsSerializer {
    @Expose()
    @ApiProperty({ name: "id", type: Number })
    id: number;

    @Expose()
    @ApiProperty({ name: "status", enum: ETransactionStatus })
    status: ETransactionStatus;

    @Expose()
    @ApiPropertyOptional({ name: "amount", type: Number })
    amount?: number;

    @Expose()
    @Type(() => BankAccountsSerializer)
    @ApiPropertyOptional({ name: "bankAccount", type: BankAccountsSerializer })
    bankAccount?: BankAccountsSerializer;

    @Expose()
    @ApiPropertyOptional({ name: "transactionImage", type: String })
    transactionImage?: string;

    @Expose()
    @ApiProperty({ name: "transactionType", enum: ETransactionType })
    transactionType: string;

    @Expose()
    @ApiPropertyOptional({ name: "adminsMessage", type: String })
    adminsMessage?: string;

    @Expose()
    @Type(() => UsersSerializer)
    @ApiProperty({ name: "user", type: UsersSerializer })
    user: UsersSerializer;

    @Expose()
    @ApiProperty({ name: "createdAt", type: Date })
    createdAt: Date;

    @Expose()
    @ApiProperty({ name: "updatedAt", type: Date })
    updatedAt: Date;
}