
import {
    BooleanFieldComparisonsDto,
    NumberFieldComparisonTypeDto,
    StringFieldComparisonsDto
} from "src/common/nestjs-typeorm-query/filter-comparisons";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { UserRoleComparisons } from "./user-role.comparisons";

class UserFilters_firstAndOrClause {
    @ApiPropertyOptional({ name: "id", type: NumberFieldComparisonTypeDto })
    id?: NumberFieldComparisonTypeDto;

    @ApiPropertyOptional({ name: "name", type: StringFieldComparisonsDto })
    name?: StringFieldComparisonsDto;

    @ApiPropertyOptional({ name: "email", type: StringFieldComparisonsDto })
    email?: StringFieldComparisonsDto;

    @ApiPropertyOptional({ name: "username", type: StringFieldComparisonsDto })
    username?: StringFieldComparisonsDto;

    @ApiPropertyOptional({ name: "lastName", type: StringFieldComparisonsDto })
    lastName?: StringFieldComparisonsDto;

    @ApiPropertyOptional({ name: "age", type: NumberFieldComparisonTypeDto })
    age?: NumberFieldComparisonTypeDto;

    @ApiPropertyOptional({ name: "isActive", type: BooleanFieldComparisonsDto })
    isActive?: BooleanFieldComparisonsDto;

    @ApiPropertyOptional({ name: "role", type: UserRoleComparisons })
    role?: UserRoleComparisons;
}

export class UserFilters {
    @ApiPropertyOptional({ name: "id", type: NumberFieldComparisonTypeDto })
    id?: NumberFieldComparisonTypeDto;

    @ApiPropertyOptional({ name: "name", type: StringFieldComparisonsDto })
    name?: StringFieldComparisonsDto;

    @ApiPropertyOptional({ name: "email", type: StringFieldComparisonsDto })
    email?: StringFieldComparisonsDto;

    @ApiPropertyOptional({ name: "username", type: StringFieldComparisonsDto })
    username?: StringFieldComparisonsDto;

    @ApiPropertyOptional({ name: "lastName", type: StringFieldComparisonsDto })
    lastName?: StringFieldComparisonsDto;

    @ApiPropertyOptional({ name: "age", type: NumberFieldComparisonTypeDto })
    age?: NumberFieldComparisonTypeDto;

    @ApiPropertyOptional({ name: "isActive", type: BooleanFieldComparisonsDto })
    isActive?: BooleanFieldComparisonsDto;

    @ApiPropertyOptional({ name: "role", type: UserRoleComparisons })
    role?: any;

    @ApiPropertyOptional({ name: "and", type: UserFilters_firstAndOrClause, isArray: true })
    and?: UserFilters_firstAndOrClause[];

    @ApiPropertyOptional({ name: "or", type: UserFilters_firstAndOrClause, isArray: true })
    or?: UserFilters_firstAndOrClause[];
}