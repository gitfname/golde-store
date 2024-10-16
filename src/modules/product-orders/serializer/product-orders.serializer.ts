import { Expose, Type } from "class-transformer"
import { EProductOrdersStatus } from "../product-orders.enum";
import { UsersSerializer } from "src/common/users/dto";
import { ProductsSerializer } from "src/modules/products/serializer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ProductOrdersSerializer {
    @ApiProperty({ name: "id", type: Number })
    @Expose()
    id: number;

    @ApiProperty({ name: "products", type: ProductsSerializer, isArray: true })
    @Expose()
    @Type(() => ProductsSerializer)
    products: ProductsSerializer[];

    @ApiPropertyOptional({ name: "adminMessage", type: String })
    @Expose()
    adminMessage?: string;

    @ApiProperty({ name: "price", type: String })
    @Expose()
    price: number;

    @ApiProperty({ name: "status", enum: EProductOrdersStatus })
    @Expose()
    status: EProductOrdersStatus;

    @ApiProperty({ name: "user", type: UsersSerializer })
    @Expose()
    @Type(() => UsersSerializer)
    user: UsersSerializer;

    @ApiProperty({ name: "createdAt", type: Date })
    @Expose()
    createdAt: Date;

    @ApiProperty({ name: "updatedAt", type: Date })
    @Expose()
    updatedAt: Date;
}