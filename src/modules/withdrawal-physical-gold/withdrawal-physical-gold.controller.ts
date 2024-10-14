import { Controller, Post, Get, Put, Delete, Param, Query, Body, Req, UseGuards, ParseIntPipe } from "@nestjs/common"
import { WithdrawalPhysicalGoldService } from "./withdrawal-physical-gold.service"
import { CreateWithdrawalPhysicalGoldDto, FindAllQueryDto, UpdateWithdrawalPhysicalGoldDto } from "./dto"
import { type Request } from "express"
import { AuthGuard, RoleGuard } from "src/common/guards"
import { WithdrawalPhysicalGoldSerializer } from "./serializer"
import { PagingDto } from "src/common/nestjs-typeorm-query/paging"
import { plainToInstance } from "class-transformer"
import { Roles } from "src/common/rbac/roles.decorator"
import { ERoles } from "src/common/rbac/user-roles.enum"
import { ApiBearerAuth, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger"
import { EWithdrawalPhysicalGoldStatus } from "./withdrawal-physical-gold.enum"

@Controller("withdrawal-physical-gold")
@ApiTags("Withdrawal Physical Gold")
export class WithdrawalPhysicalGoldController {

    constructor(
        private readonly withdrawalService: WithdrawalPhysicalGoldService
    ) { }

    @Post()
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async create(
        @Body() createWithdrawal: CreateWithdrawalPhysicalGoldDto,
        @Req() req: Request
    ): Promise<void> {
        await this.withdrawalService.create(req["user"]["sub"], createWithdrawal)
    }

    @Get("my-withdrawals")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({ status: "2XX", type: WithdrawalPhysicalGoldSerializer, isArray: true })
    async findMyWithdrawals(
        @Query() pagingDto: PagingDto = { limit: 10, offset: 0 },
        @Req() req: Request
    ): Promise<{ data: WithdrawalPhysicalGoldSerializer[], count: number }> {
        const withdrawals = await this.withdrawalService.findAll(pagingDto, { userId: req["user"]["sub"] })

        const serializedWithdrawals = plainToInstance(
            WithdrawalPhysicalGoldSerializer,
            withdrawals[0]
        )

        return {
            data: serializedWithdrawals,
            count: withdrawals[1]
        }
    }

    @Get()
    @Roles(ERoles.SuperAdmin, ERoles.Admin)
    @UseGuards(AuthGuard, RoleGuard)
    @ApiBearerAuth()
    @ApiOkResponse({ status: "2XX", type: WithdrawalPhysicalGoldSerializer, isArray: true })
    @ApiQuery({ name: "paging[limit]", type: Number, required: false })
    @ApiQuery({ name: "paging[offset]", type: Number, required: false })
    @ApiQuery({ name: "query[userId]", type: Number, required: false })
    @ApiQuery({ name: "query[status]", enum: EWithdrawalPhysicalGoldStatus, required: false })
    async findAll(
        @Query("paging") pagingDto: PagingDto,
        @Query("query") findAllQueryDto: FindAllQueryDto
    ): Promise<{ data: WithdrawalPhysicalGoldSerializer[], count: number }> {
        const withdrawals = await this.withdrawalService.findAll(pagingDto, findAllQueryDto)

        const serializedWithdrawals = plainToInstance(
            WithdrawalPhysicalGoldSerializer,
            withdrawals[0]
        )

        return {
            data: serializedWithdrawals,
            count: withdrawals[1]
        }
    }

    @Get(":id")
    @ApiBearerAuth()
    @ApiOkResponse({ status: "2XX", type: WithdrawalPhysicalGoldSerializer })
    @ApiParam({ name: "id", type: Number })
    async findOneById(@Param("id", ParseIntPipe) id: number): Promise<WithdrawalPhysicalGoldSerializer> {
        return plainToInstance(
            WithdrawalPhysicalGoldSerializer,
            await this.withdrawalService.findOneById(id)
        )
    }

    @Put(":id")
    @Roles(ERoles.SuperAdmin, ERoles.Admin)
    @UseGuards(AuthGuard, RoleGuard)
    @ApiBearerAuth()
    @ApiParam({ name: "id", type: Number })
    async updateOneById(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateWithdrawalDto: UpdateWithdrawalPhysicalGoldDto
    ): Promise<void> {
        await this.withdrawalService.updateOneById(id, updateWithdrawalDto)
    }

    @Delete(":id")
    @Roles(ERoles.SuperAdmin, ERoles.Admin)
    @UseGuards(AuthGuard, RoleGuard)
    @ApiBearerAuth()
    @ApiParam({ name: "id", type: Number })
    async deleteOneById(@Param("id", ParseIntPipe) id: number): Promise<void> {
        await this.withdrawalService.deleteOneById(id)
    }

}