import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { Injectable, ExecutionContext, CanActivate } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { type Request } from "express"
import { SET_OWNERSHIP_KEY } from "../decorators";
import { convertStringToNestedObject } from "src/helpers";

@Injectable()
export class OwnershipGuard implements CanActivate {

    constructor(
        private readonly reflector: Reflector,
        @InjectDataSource() private readonly dataSource: DataSource
    ) { }

    async canActivate(context: ExecutionContext) {
        const req: Request = context.switchToHttp().getRequest()
        const userId = req["user"]["sub"]
        const { entityClass, ownerColumn, reqParam, isReqParamStr, throwForbidden, ownerColumnPath } =
            this.reflector.get<{
                entityClass: any; ownerColumn: string; reqParam: string | number, isReqParamStr: boolean,
                throwForbidden: boolean; ownerColumnPath?: string
            }>(SET_OWNERSHIP_KEY, context.getHandler())
        const repo = this.dataSource.getRepository(entityClass)

        let isOwner: any

        if (ownerColumnPath) {
            isOwner = await repo.findOne({
                where: {
                    id: isReqParamStr ? req.params[reqParam] : +req.params[reqParam],
                    ...convertStringToNestedObject(ownerColumnPath, userId)
                }
            })
        }
        else {
            isOwner = await repo.findOne({
                where: {
                    id: isReqParamStr ? req.params[reqParam] : +req.params[reqParam],
                    [ownerColumn]: {
                        id: userId
                    }
                }
            })
        }

        req["is-owner-of-resource"] = !!isOwner

        if (!isOwner && throwForbidden) return false

        return true
    }
}