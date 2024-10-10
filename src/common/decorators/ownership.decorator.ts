import { SetMetadata } from "@nestjs/common";

export const SET_OWNERSHIP_KEY = "owner-ship"

export const SetOwnerShip = (
    { entityClass, isReqParamStr, ownerColumn, reqParam, throwForbidden, ownerColumnPath = "" }:
        {
            entityClass: any; ownerColumn: string; reqParam: string | number, isReqParamStr: boolean,
            throwForbidden: boolean; ownerColumnPath?: string
        }
) => SetMetadata(SET_OWNERSHIP_KEY, { entityClass, isReqParamStr, ownerColumn, reqParam, throwForbidden, ownerColumnPath })