import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { ProductCategoriesSerializer } from "src/modules/product-categories/serializer";

export class ProductsSerializer {
    @ApiProperty({ name: "id", type: Number })
    @Expose()
    id: number;

    @ApiProperty({ name: "title", type: String })
    @Expose()
    title: string;

    @ApiProperty({ name: "description", type: String })
    @Expose()
    description: string;

    @ApiProperty({ name: "price", type: Number })
    @Expose()
    price: number;

    @ApiProperty({ name: "fee", type: Number })
    @Expose()
    fee: number;

    @ApiProperty({ name: "thumbnailImage", type: String })
    @Expose()
    thumbnailImage: string;

    @ApiProperty({ name: "coverImage", type: String })
    @Expose()
    coverImage: string;

    @ApiProperty({ name: "amountOfGoldUsed", type: Number })
    @Expose()
    amountOfGoldUsed: number;

    @ApiProperty({ name: "isActive", type: Boolean })
    @Expose()
    isActive: boolean;

    @ApiProperty({ name: "isAvailable", type: Boolean })
    @Expose()
    isAvailable: boolean;

    @Expose()
    @Type(() => ProductCategoriesSerializer)
    category?: ProductCategoriesSerializer;

    @ApiProperty({ name: "createdAt", type: Date })
    @Expose()
    createdAt: Date;

    @ApiProperty({ name: "updatedAt", type: Date })
    @Expose()
    updatedAt: Date;
}