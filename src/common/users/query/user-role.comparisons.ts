import { ApiPropertyOptional } from "@nestjs/swagger";
import { ERoles } from "src/common/rbac/user-roles.enum";

export class UserRoleComparisons {
    @ApiPropertyOptional({ name: "eq", enum: ERoles })
    eq?: ERoles;

    @ApiPropertyOptional({ name: "in", enum: ERoles, isArray: true })
    in?: ERoles[];

    @ApiPropertyOptional({ name: "like", enum: ERoles })
    like?: ERoles;

    @ApiPropertyOptional({ name: "neq", enum: ERoles })
    neq?: ERoles;

    @ApiPropertyOptional({ name: "notILike", enum: ERoles })
    notILike?: ERoles;

    @ApiPropertyOptional({ name: "notIn", enum: ERoles, isArray: true })
    notIn?: ERoles[];

    @ApiPropertyOptional({ name: "notLike", enum: ERoles })
    notLike?: ERoles;
}