import { SetMetadata } from "@nestjs/common";
import { Filter, Query } from "@ptc-org/nestjs-query-core";

export const SET_ACCESS_CONTROLLER_KEY = "access-controller-key"

export function SetAccessControllerRules<T>(
    { entityClass, filter }:
        { entityClass: any; filter: Filter<T> }
) {
    return SetMetadata(SET_ACCESS_CONTROLLER_KEY, { entityClass, filter })
}