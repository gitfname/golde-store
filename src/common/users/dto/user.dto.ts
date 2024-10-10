
import { Expose, Transform } from "class-transformer"
import { ERoles } from "src/common/rbac/user-roles.enum";
import { ApiProperty } from "@nestjs/swagger";

export class UsersSerializer {
  @ApiProperty({ name: "id", type: Number })
  @Expose()
  id: number;

  @ApiProperty({ name: "firstName", type: String })
  @Expose()
  firstName: string;

  @ApiProperty({ name: "lastName", type: String })
  @Expose()
  lastName: string;

  @ApiProperty({ name: "fatherName", type: String })
  @Expose()
  fatherName: string;

  @ApiProperty({ name: "nationalCode", type: String })
  @Expose()
  nationalCode: string;

  @ApiProperty({ name: "nationalCardSerial", type: String })
  @Expose()
  nationalCardSerial: string;

  @ApiProperty({ name: "solarBirthDate", type: Date })
  @Expose()
  solarBirthDate: Date;

  @ApiProperty({ name: "phone", type: String })
  @Expose()
  phone: string;

  @Expose()
  isDetailsAccepted: boolean;

  @Expose()
  rial: number;

  @Expose()
  gold: number;

  @ApiProperty({ name: "role", enum: ERoles })
  @Expose()
  role: ERoles;
}