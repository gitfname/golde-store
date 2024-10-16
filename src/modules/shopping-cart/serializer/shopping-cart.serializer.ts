import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer"
import { UsersSerializer } from "src/common/users/dto";
import { ProductsSerializer } from "src/modules/products/serializer";

export class ShoppingCartSerializer {
    @ApiProperty({ name: "id", type: Number })
    @Expose()
    id: number;

    @ApiProperty({ name: "user", type: UsersSerializer })
    @Expose()
    @Type(() => UsersSerializer)
    user: UsersSerializer;

    @ApiProperty({ name: "products", type: ProductsSerializer, isArray: true })
    @Expose()
    @Type(() => ProductsSerializer)
    products: ProductsSerializer[];

    @ApiProperty({ name: "createdAt", type: Date })
    @Expose()
    createdAt: Date;
}