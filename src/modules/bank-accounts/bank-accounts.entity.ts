import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { User } from "src/common/users/user.entity";
import { ApiProperty } from "@nestjs/swagger";
import { UsersSerializer } from "src/common/users/dto";

@Entity({ name: "bank-accounts" })
export class BankAccounts {
    @ApiProperty({ name: "id", type: Number })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ name: "shabaNumber", type: String })
    @Column("varchar", { length: 200 })
    shabaNumber: string;

    @ApiProperty({ name: "user", type: UsersSerializer })
    @ManyToOne(() => User)
    @JoinColumn()
    user: User;

    @ApiProperty({ name: "createdAt", type: Date })
    @CreateDateColumn()
    createdAt: Date

    @ApiProperty({ name: "updatedAt", type: Date })
    @UpdateDateColumn()
    updatedAt: Date;
}