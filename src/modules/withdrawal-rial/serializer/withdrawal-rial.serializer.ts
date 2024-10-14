import { Expose, Type } from "class-transformer"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { UsersSerializer } from "src/common/users/dto";
import { BankAccountsSerializer } from "src/modules/bank-accounts/serializer";
import { EWithdrawalRialStatus } from "../withdrawal-rial.enum";

export class WithdrawalRialSerializer {
    @ApiProperty({ name: "id", type: Number })
    @Expose()
    id: number;

    @ApiProperty({ name: "user", type: UsersSerializer })
    @Expose()
    @Type(() => UsersSerializer)
    user: UsersSerializer;

    @ApiProperty({ name: "bankAccount", type: BankAccountsSerializer })
    @Expose()
    @Type(() => BankAccountsSerializer)
    bankAccount: BankAccountsSerializer;

    @ApiPropertyOptional({ name: "description", type: String })
    @Expose()
    description?: string;

    @ApiProperty({ name: "withdrawalAmount", type: Number })
    @Expose()
    withdrawalAmount: number;

    @Expose()
    status: EWithdrawalRialStatus;

    @ApiProperty({ name: "createdAt", type: Date })
    @Expose()
    created_at: Date;

    @ApiProperty({ name: "updatedAt", type: Date })
    @Expose()
    updated_at: Date;
}