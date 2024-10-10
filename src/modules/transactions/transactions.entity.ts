
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { BankAccounts } from "../bank-accounts/bank-accounts.entity";
import { ETransactionStatus, ETransactionType } from "./transactions.enum";
import { User } from "src/common/users/user.entity";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { BankAccountsSerializer } from "../bank-accounts/serializer";
import { UsersSerializer } from "src/common/users/dto";

@Entity({ name: "transactions" })
export class Transactions {
    @PrimaryGeneratedColumn()
    @ApiProperty({ name: "id", type: Number })
    id: number;

    @ManyToOne(() => BankAccounts, { onDelete: "SET NULL", nullable: true })
    @JoinColumn()
    @ApiPropertyOptional({ name: "bankAccount", type: BankAccountsSerializer })
    bankAccount?: BankAccounts;

    @Column("varchar", { length: 24 })
    @ApiProperty({ name: "status", enum: ETransactionStatus })
    status: ETransactionStatus;

    @Column("varchar", { length: 40 })
    @ApiProperty({ name: "transactionType", enum: ETransactionType })
    transactionType: string;

    @Column("int", { width: 9, nullable: true })
    @ApiPropertyOptional({ name: "amount", type: Number })
    amount?: number;

    @Column("decimal", { nullable: true })
    @ApiPropertyOptional({ name: "goldAmount", type: Number })
    goldAmount: string;

    @Column("varchar", { length: 200, nullable: true })
    @ApiPropertyOptional({ name: "transactionImage", type: String })
    transactionImage?: string;

    @Column("varchar", { length: 650, nullable: true })
    @ApiPropertyOptional({ name: "adminsMessage", type: String })
    adminsMessage?: string

    @ManyToOne(() => User)
    @JoinColumn()
    @ApiProperty({ name: "user", type: UsersSerializer })
    user: User;

    @Column("int", { width: 9, nullable: true })
    @ApiPropertyOptional({ name: "increaseRialAmount", type: Number })
    increaseRialAmount: number;

    @Column("int", { width: 5, nullable: true })
    @ApiPropertyOptional({ name: "increaseGoldAmount", type: Number })
    increaseGoldAmount: number;

    @CreateDateColumn()
    @ApiProperty({ name: "createdAt", type: Date })
    createdAt: Date;

    @UpdateDateColumn()
    @ApiProperty({ name: "updatedAt", type: Date })
    updatedAt: Date;
}