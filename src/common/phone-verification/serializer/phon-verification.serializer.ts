
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer"

export class PhoneVerificationSerializer {
    @ApiProperty({ name: "id", type: Number })
    @Expose()
    id: number;

    @ApiProperty({ name: "phone", type: String })
    @Expose()
    phone: string;

    @ApiProperty({ name: "retries", type: Number })
    @Expose()
    retries: number;

    @ApiProperty({ name: "date", type: Date })
    date: Date;

    @ApiProperty({ name: "createdAt", type: Date })
    @Expose()
    createdAt: Date;

    @ApiProperty({ name: "updatedAt", type: Date })
    @Expose()
    updatedAt: Date;
}