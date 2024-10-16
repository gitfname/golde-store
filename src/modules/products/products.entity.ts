import { ApiProperty } from "@nestjs/swagger";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity({ name: "products" })
export class Products {
    @PrimaryGeneratedColumn()
    @ApiProperty({ name: "id", type: Number })
    id: number;

    @Column("varchar", { length: 300 })
    @ApiProperty({ name: "title", type: String })
    title: string;

    @Column("varchar", { length: 600, nullable: true })
    @ApiProperty({ name: "description", type: String })
    description?: string;

    @Column("varchar", { length: 220 })
    @ApiProperty({ name: "thumbnailImage", type: String })
    thumbnailImage: string;

    @Column("varchar", { length: 220 })
    @ApiProperty({ name: "coverImage", type: String })
    coverImage: string;

    @Column("decimal", { scale: 4 })
    @ApiProperty({ name: "amountOfGoldUsed", type: Number })
    amountOfGoldUsed: string | number;

    @Column("int", { width: 2 })
    @ApiProperty({ name: "fee", type: Number })
    fee: number;

    @Column("boolean", { default: true })
    @ApiProperty({ name: "isActive", type: Boolean })
    isActive: boolean;

    @Column("boolean", { default: true })
    @ApiProperty({ name: "isAvailable", type: Boolean })
    isAvailable: boolean;

    @CreateDateColumn()
    @ApiProperty({ name: "createdAt", type: Date })
    createdAt: Date;

    @UpdateDateColumn()
    @ApiProperty({ name: "updatedAt", type: Date })
    updatedAt: Date;
}