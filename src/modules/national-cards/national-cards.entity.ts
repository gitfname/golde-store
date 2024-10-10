import { User } from "src/common/users/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm"
import { ENationalCardRejectionReason, ENationalCardStatus } from "./national-cards.enum";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { UsersSerializer } from "src/common/users/dto";

@Entity({ name: "national-cards" })
export class NationalCard {
    @ApiProperty({ name: "id", type: Number })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ name: "status", enum: [ENationalCardStatus] })
    @Column("varchar", { length: 28, default: ENationalCardStatus.Pending })
    status: ENationalCardStatus;

    @ApiPropertyOptional({ name: "adminMessage", type: String })
    @Column("varchar", { length: 500, nullable: true })
    adminMessage?: string;

    @ApiPropertyOptional({ name: "rejectionReason", enum: ENationalCardRejectionReason })
    @Column("varchar", { length: 50, nullable: true })
    rejectionReason?: ENationalCardRejectionReason;

    @ApiProperty({ name: "frontImage", type: String })
    @Column("varchar", { length: 200 })
    frontImage: string;

    @ApiProperty({ name: "backImage", type: String })
    @Column("varchar", { length: 200 })
    backImage: string;

    @ApiProperty({ name: "user", type: UsersSerializer })
    @ManyToOne(() => User)
    @JoinColumn()
    user: User;

    @ApiProperty({ name: "createdAt", type: Date })
    @CreateDateColumn()
    createdAt: Date;
}