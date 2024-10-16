import { User } from "src/common/users/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from "typeorm"
import { Products } from "../products/products.entity";
import { EProductOrdersStatus } from "./product-orders.enum";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { UsersSerializer } from "src/common/users/dto";
import { ProductsSerializer } from "../products/serializer";

@Entity({ name: "product-orders" })
export class ProductOrders {
    @ApiProperty({ name: "id", type: Number })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ name: "user", type: UsersSerializer })
    @ManyToOne(() => User)
    @JoinColumn()
    user: User;

    @ApiProperty({ name: "products", type: ProductsSerializer, isArray: true })
    @ManyToMany(() => Products)
    @JoinTable()
    products: Products[];
    
    @ApiProperty({ name: "price", type: String })
    @Column("decimal", { scale: 4 })
    price: string;

    @ApiPropertyOptional({ name: "adminMessage", type: String })
    @Column("varchar", { length: 750, nullable: true })
    adminMessage?: string;

    @ApiProperty({ name: "status", enum: EProductOrdersStatus })
    @Column("varchar", { length: 28 })
    status: EProductOrdersStatus;

    @ApiProperty({ name: "createdAt", type: Date })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ name: "updatedAt", type: Date })
    @UpdateDateColumn()
    updatedAt: Date;
}