import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer"

export class LoginResponseDto {
    @ApiProperty({ name: "access_token", type: String })
    @Expose()
    access_token: string;
}