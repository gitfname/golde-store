import { UserFilters } from "./user-filters";
import { UserSorting } from "./user-sorting";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { PagingDto } from "src/common/nestjs-typeorm-query/paging";

export class UserQuery {
    @ApiPropertyOptional({ name: "filter", type: UserFilters })
    filter?: UserFilters;

    @ApiPropertyOptional({ name: "paging", type: PagingDto })
    paging?: PagingDto;

    // relations?: SelectRelation<User>[];

    @ApiPropertyOptional({ name: "sorting", type: UserSorting })
    sorting?: UserSorting[];
}