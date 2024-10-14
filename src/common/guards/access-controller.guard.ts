import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { Injectable, ExecutionContext, CanActivate } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { type Request } from "express"
import { SET_ACCESS_CONTROLLER_KEY } from "../decorators";
import { TypeOrmQueryService } from "@ptc-org/nestjs-query-typeorm"
import { Filter, type Query } from "@ptc-org/nestjs-query-core"
import recursiveObjectStringReplacement from "src/helpers/recursiveObjectStringReplacement";

@Injectable()
export class AccessControllerGuard implements CanActivate {

    constructor(
        private readonly reflector: Reflector,
        @InjectDataSource() private readonly dataSource: DataSource
    ) { }

    async canActivate(context: ExecutionContext) {
        const req: Request = context.switchToHttp().getRequest()
        const userId = req["user"]["sub"]
        const { entityClass, filter } =
            this.reflector.get<{
                entityClass: any; filter: Filter<any>
            }>(SET_ACCESS_CONTROLLER_KEY, context.getHandler())
        const repo = this.dataSource.getRepository(entityClass)
        const enhancedRepo = new TypeOrmQueryService(repo)
        const parsedFilterObject = recursiveObjectStringReplacement(
            filter,
            {
                "{{CURRENT_USER}}": userId
            }
        )

        let isAllowed: any

        isAllowed = await enhancedRepo.count(parsedFilterObject)

        if (isAllowed) return true

        return false
    }
}