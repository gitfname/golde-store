import { ApiProperty } from "@nestjs/swagger";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity({ name: "phone-verification" })
export class PhoneVerification {
    @PrimaryGeneratedColumn()
    @ApiProperty({ name: "id", type: Number })
    id: number;

    @ApiProperty({ name: "phone", type: String })
    @Column("char", { length: 11 })
    phone: string;

    @ApiProperty({ name: "code", type: String })
    @Column("varchar", { length: 5 })
    code: string;

    @ApiProperty({ name: "retries", type: Number })
    @Column("int", { width: 1 })
    retries: number;

    @ApiProperty({ name: "date", type: Date })
    @Column("timestamp", { default: new Date() })
    date: Date;

    @ApiProperty({ name: "createdAt", type: Date })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ name: "updatedAt", type: Date })
    @UpdateDateColumn()
    updatedAt: Date;
}