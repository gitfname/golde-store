import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer"
import { UsersSerializer } from "src/common/users/dto";

export class BankAccountsSerializer {
    @ApiProperty({ name: "id", type: Number })
    @Expose()
    id: number;

    @ApiProperty({ name: "shabaNumber", type: String })
    @Expose()
    shabaNumber: string;

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