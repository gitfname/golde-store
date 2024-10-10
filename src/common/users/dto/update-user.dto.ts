import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  MaxLength,
  IsOptional,
  IsDate,
} from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ name: "firstName", type: String })
  @IsOptional()
  @IsString()
  @MaxLength(220)
  firstName: string;

  @ApiPropertyOptional({ name: "lastName", type: String })
  @IsOptional()
  @IsString()
  @MaxLength(220)
  lastName: string;

  @ApiPropertyOptional({ name: "fatherName", type: String })
  @IsOptional()
  @IsString()
  @MaxLength(220)
  fatherName: string;

  @ApiPropertyOptional({ name: "nationalCode", type: String })
  @IsOptional()
  @IsString()
  @MaxLength(11)
  nationalCode: string;

  @ApiPropertyOptional({ name: "nationalCardSerial", type: String })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  nationalCardSerial: string;

  @ApiPropertyOptional({ name: "solarBirthDate", type: Date })
  @IsOptional()
  @IsDate()
  solarBirthDate: Date;
}
