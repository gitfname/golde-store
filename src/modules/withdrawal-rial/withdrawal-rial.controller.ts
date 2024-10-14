import { Body, Controller, Delete, Get, Param, Post, ParseIntPipe, Put, Query, Req, UseGuards } from "@nestjs/common";
import { WithdrawalRialService } from "./withdrawal-rial.service";
import { WithdrawalRialSerializer } from "./serializer";
import { CreateWithdrawalRialDto, FindAllQueryDto, UpdateWithdrawalRialDto } from "./dto";
import { plainToInstance } from "class-transformer";
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags, ApiQuery, ApiParam, ApiBearerAuth } from "@nestjs/swagger"
import { PagingDto } from "src/common/nestjs-typeorm-query/paging";
import { type Request } from "express"
import { AccessControllerGuard, AuthGuard, RoleGuard } from "src/common/guards";
import { Roles } from "src/common/rbac/roles.decorator";
import { ERoles } from "src/common/rbac/user-roles.enum";
import { EWithdrawalRialStatus } from "./withdrawal-rial.enum";
import { SetAccessControllerRules } from "src/common/decorators";
import { Filter } from "@ptc-org/nestjs-query-core";
import { WithdrawalRial } from "./withdrawal-rial.entity";

@Controller("withdrawal-rial")
@ApiTags("Withdrawal Rial")
export class WithdrawalRialController {

    constructor(
        private readonly withdrawalRialService: WithdrawalRialService
    ) { }

    @Post()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: "Create an withdrawal rial request" })
    @ApiCreatedResponse({ status: "2XX" })
    @ApiBearerAuth()
    async create(
        @Body() createWithdrawalRialDto: CreateWithdrawalRialDto,
        @Req() req: Request
    ): Promise<WithdrawalRialSerializer> {
        return plainToInstance(
            WithdrawalRialSerializer,
            await this.withdrawalRialService.create(req["user"]["sub"], createWithdrawalRialDto),
            { excludeExtraneousValues: true }
        )
    }

    @Get("my-withdrawals")
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: "Get all my withdrawal rial requests" })
    @ApiOkResponse({ status: "2XX", type: WithdrawalRialSerializer, isArray: true })
    @ApiQuery({ name: "paging", type: PagingDto, required: false })
    @ApiBearerAuth()
    async findAllMyWithdrawalRialRequests(
        @Query("paging") pagingDto: PagingDto = { offset: 0, limit: 15 },
        @Req() req: Request
    ): Promise<{ data: WithdrawalRialSerializer[], count: number }> {
        const data = await this.withdrawalRialService.findAll(pagingDto, { userId: req["user"]["sub"] })

        const serializedData = plainToInstance(
            WithdrawalRialSerializer,
            data[0],
            { excludeExtraneousValues: true }
        )

        return {
            data: serializedData,
            count: data[1]
        }
    }

    @Get()
    @Roles(ERoles.SuperAdmin, ERoles.Admin)
    @UseGuards(AuthGuard, RoleGuard)
    @ApiOperation({ summary: "Get all the withdrawal rial requests" })
    @ApiOkResponse({ status: "2XX", type: WithdrawalRialSerializer, isArray: true })
    @ApiQuery({ name: "paging", type: PagingDto, required: false })
    @ApiParam({ name: "paging[offset]", type: Number, required: false })
    @ApiParam({ name: "paging[limit]", type: Number, required: false })
    @ApiParam({ name: "query[userId]", type: Number, required: false })
    @ApiParam({ name: "query[status]", enum: EWithdrawalRialStatus, required: false })
    @ApiBearerAuth()
    async findAll(
        @Query("paging") pagingDto: PagingDto = { offset: 0, limit: 15 },
        @Query("query") findAllQueryDto: FindAllQueryDto,
    ): Promise<{ data: WithdrawalRialSerializer[], count: number }> {
        const data = await this.withdrawalRialService.findAll(pagingDto, findAllQueryDto)

        const serializedData = plainToInstance(
            WithdrawalRialSerializer,
            data[0]
        )

        console.log(data)

        return {
            data: serializedData,
            count: data[1]
        }
    }

    @Get(":id")
    @SetAccessControllerRules({
        entityClass: "withdrawal-rial",
        filter: {
            user: {
                id: {
                    eq: "{{CURRENT_USER}}"
                }
            }
        } as Filter<WithdrawalRial>
    })
    @UseGuards(AuthGuard, AccessControllerGuard)
    @ApiOperation({ summary: "Get one withdrawal rial request by ID" })
    @ApiOkResponse({ status: "2XX", type: WithdrawalRialSerializer })
    @ApiParam({ name: "id", type: Number })
    @ApiBearerAuth()
    async findOne(@Param("id", ParseIntPipe) id: number): Promise<WithdrawalRialSerializer> {
        return plainToInstance(
            WithdrawalRialSerializer,
            await this.withdrawalRialService.findOne(id)
        )
    }

    @Put(":id")
    @Roles(ERoles.SuperAdmin, ERoles.Admin)
    @UseGuards(AuthGuard, RoleGuard)
    @ApiOperation({ summary: "Update an withdrawal rial request by ID" })
    @ApiOkResponse({ status: "2XX" })
    @ApiParam({ name: "id", type: Number })
    @ApiBearerAuth()
    async update(
        @Param("id", ParseIntPipe) id: number,

        @Body() updateWithdrawalRialDto: UpdateWithdrawalRialDto
    ): Promise<void> {
        await this.withdrawalRialService.update(id, updateWithdrawalRialDto)
    }

    @Delete(":id")
    @Roles(ERoles.SuperAdmin, ERoles.Admin)
    @UseGuards(AuthGuard, RoleGuard)
    @ApiOperation({ summary: "Delete an withdrawal rial request by ID" })
    @ApiOkResponse({ status: "2XX" })
    @ApiParam({ name: "id", type: Number })
    @ApiBearerAuth()
    async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
        await this.withdrawalRialService.delete(id)
    }
}