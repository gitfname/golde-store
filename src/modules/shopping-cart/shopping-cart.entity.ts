
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, ManyToMany, JoinTable } from "typeorm"
import { Products } from "../products/products.entity";
import { User } from "src/common/users/user.entity";
import { ApiProperty } from "@nestjs/swagger";
import { UsersSerializer } from "src/common/users/dto";
import { ProductsSerializer } from "../products/serializer";

@Entity({ name: "shopping-cart" })
export class ShoppingCart {
    @ApiProperty({ name: "id", type: Number })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ name: "user", type: UsersSerializer })
    @ManyToOne(() => User)
    @JoinColumn()
    user: User;

    @ApiProperty({ name: "products", type: ProductsSerializer, isArray: true })
    @ManyToMany(() => Products, { onDelete: "SET NULL" })
    @JoinTable()
    products: Products[];

    @ApiProperty({ name: "createdAt", type: Date })
    @CreateDateColumn()
    createdAt: Date;
}