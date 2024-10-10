import {
  IsString,
  MaxLength,
  MinLength
} from 'class-validator';
import { ApiProperty } from "@nestjs/swagger"

export class CreateUserDto {
  @ApiProperty({ name: "phone", type: String })
  @IsString()
  @MaxLength(11)
  @MinLength(11)
  phone: string;
}
