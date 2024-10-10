import { Expose, Type } from "class-transformer"
import { ENationalCardRejectionReason, ENationalCardStatus } from "../national-cards.enum";
import { UsersSerializer } from "src/common/users/dto";
import { ApiProperty } from "@nestjs/swagger";

export class NationalCardsSerializer {
    @Expose()
    @ApiProperty({ name: "id", type: Number })
    id: number;

    @Expose()
    @ApiProperty({ name: "status", enum: ENationalCardStatus })
    status: ENationalCardStatus;

    @Expose()
    @ApiProperty({ name: "rejectionReason", enum: ENationalCardRejectionReason })
    rejectionReason?: ENationalCardRejectionReason;

    @Expose()
    @ApiProperty({ name: "adminMessage", type: String })
    adminMessage?: string;

    @Expose()
    @ApiProperty({ name: "backImage", type: String })
    backImage: string;

    @Expose()
    @ApiProperty({ name: "frontImage", type: String })
    frontImage: string;

    @Expose()
    @Type(() => UsersSerializer)
    @ApiProperty({ name: "user", type: UsersSerializer })
    user: UsersSerializer;

    @Expose()
    @ApiProperty({ name: "createdAt", type: Date })
    createdAt: Date;
}