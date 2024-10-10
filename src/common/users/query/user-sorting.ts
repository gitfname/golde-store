import { SortDirection, SortField } from "@ptc-org/nestjs-query-core";
import { User } from "../user.entity";
import { ApiProperty } from "@nestjs/swagger";

export class UserSorting implements SortField<User> {
    @ApiProperty({ name: "direction", enum: SortDirection })
    direction: SortDirection;

    @ApiProperty({ name: "field", enum: ["id", "name", "email", "username", "lastName", "age", "isActive", "role"] })
    field: keyof User;
}