import { ApiProperty } from "@nestjs/swagger";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity({ name: "application-data" })
export class ApplicationData {
    @ApiProperty({ name: "id", type: Number })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ name: "rialToGoldConversionRate", type: Number })
    @Column("int", { width: 10 })
    rialToGoldConversionRate: number;
}