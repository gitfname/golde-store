import { ApiProperty } from "@nestjs/swagger";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity({ name: "product-categories" })
export class ProductCategories {
    @ApiProperty({ name: "id", type: Number })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ name: "title", type: String })
    @Column("varchar", { length: 255 })
    title: string;
}