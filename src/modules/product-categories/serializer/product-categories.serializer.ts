import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer"

export class ProductCategoriesSerializer {
    @ApiProperty({ name: "id", type: Number })
    @Expose()
    id: number;

    @ApiProperty({ name: "title", type: String })
    @Expose()
    title: string;
}