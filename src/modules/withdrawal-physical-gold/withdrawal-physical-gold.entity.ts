import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { BankAccounts } from "../bank-accounts/bank-accounts.entity";
import { EWithdrawalPhysicalGoldStatus } from "./withdrawal-physical-gold.enum";
import { User } from "src/common/users/user.entity";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { UsersSerializer } from "src/common/users/dto";
import { BankAccountsSerializer } from "../bank-accounts/serializer";

@Entity({ name: "withdrawal-physical-gold" })
export class WithdrawalPhysicalGold {
    @ApiProperty({ name: "id", type: "number" })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ name: "user", type: UsersSerializer })
    @ManyToOne(() => User)
    @JoinColumn()
    user: User;

    @ApiProperty({ name: "bankAccount", type: BankAccountsSerializer })
    @ManyToOne(() => BankAccounts)
    @JoinColumn()
    bankAccount: BankAccounts;

    @ApiProperty({ name: "status", enum: EWithdrawalPhysicalGoldStatus })
    @Column("varchar", { length: 28 })
    status: EWithdrawalPhysicalGoldStatus;

    @ApiPropertyOptional({ name: "description", type: String })
    @Column("varchar", { length: 650, nullable: true })
    description?: string;

    @ApiProperty({ name: "goldAmount", type: String })
    @Column("decimal", { scale: 4 })
    goldAmount: string;

    @ApiProperty({ name: "createdAt", type: Date })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ name: "updatedAt", type: Date })
    @UpdateDateColumn()
    updatedAt: Date;
}