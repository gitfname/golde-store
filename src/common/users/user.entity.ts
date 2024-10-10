import { ApiProperty } from '@nestjs/swagger';
import { ERoles } from '../rbac/user-roles.enum';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity()
export class User {
  @ApiProperty({ name: "id", type: String })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ name: "firstName", type: String })
  @Column("varchar", { length: 220, nullable: true })
  firstName: string;

  @ApiProperty({ name: "lastName", type: String })
  @Column("varchar", { length: 220, nullable: true })
  lastName: string;

  @ApiProperty({ name: "fatherName", type: String })
  @Column("varchar", { length: 220, nullable: true })
  fatherName: string;

  @ApiProperty({ name: "nationalCode", type: String })
  @Column("varchar", { length: 11, nullable: true })
  nationalCode: string;

  @ApiProperty({ name: "nationalCardSerial", type: String })
  @Column("varchar", { length: 30, nullable: true })
  nationalCardSerial: string;

  @ApiProperty({ name: "solarBirthDate", type: Date })
  @Column("timestamp without time zone", { nullable: true })
  solarBirthDate: Date;

  @ApiProperty({ name: "phone", type: String })
  @Column("varchar", { length: 11 })
  phone: string;

  @Column("boolean", { default: false })
  isDetailsAccepted: boolean;

  @Column("int", { width: 9, default: 0 })
  rial: number;

  @Column("decimal", { default: 0.0000 })
  gold: string;

  @ApiProperty({ name: "role", enum: ERoles })
  @Column("varchar", { length: 33 })
  role: ERoles;
}
