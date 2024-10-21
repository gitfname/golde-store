import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer"

export class ApplicationDataSerializer {
    @ApiProperty({ name: "id", type: Number })
    @Expose()
    id: number;

    @ApiProperty({ name: "rialToGoldConversionRate", type: Number })
    @Expose()
    rialToGoldConversionRate: number;
}