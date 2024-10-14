import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { UsersSerializer } from "src/common/users/dto";
import { User } from "src/common/users/user.entity";
import { BankAccountsSerializer } from "../bank-accounts/serializer";
import { BankAccounts } from "../bank-accounts/bank-accounts.entity";
import { EWithdrawalRialStatus } from "./withdrawal-rial.enum";

@Entity({ name: "withdrawal-rial" })
export class WithdrawalRial {
    @ApiProperty({ name: "id", type: Number })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ name: "user", type: UsersSerializer })
    @ManyToOne(() => User)
    @JoinColumn()
    user: User

    @ApiProperty({ name: "bankAccount", type: BankAccountsSerializer })
    @ManyToOne(() => BankAccounts)
    @JoinColumn()
    bankAccount: BankAccounts

    @ApiPropertyOptional({ name: "description", type: String })
    @Column("varchar", { nullable: true, length: 650 })
    description?: string

    @ApiProperty({ name: "withdrawalAmount", type: Number })
    @Column("int")
    withdrawalAmount: number

    @Column("varchar", { length: 28 })
    status: EWithdrawalRialStatus;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn({ nullable: true })
    updated_at: Date;

}