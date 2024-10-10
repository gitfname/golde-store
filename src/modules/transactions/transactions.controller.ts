import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { CreateTransactionDto, FindAllQueryDto, UpdateTransactionDto } from "./dto";
import { AuthGuard, RoleGuard } from "src/common/guards";
import { Request } from "express";
import { TransactionsSerializer } from "./serializer";
import { PagingDto } from "src/common/nestjs-typeorm-query/paging";
import { plainToInstance } from "class-transformer";
import { FormDataRequest } from "nestjs-form-data"
import { Roles } from "src/common/rbac/roles.decorator";
import { ERoles } from "src/common/rbac/user-roles.enum";
import { ApiBearerAuth, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ETransactionStatus } from "./transactions.enum";

@Controller("transactions")
@ApiTags("Transactions")
export class TransactionsController {

    constructor(
        private readonly transactionsService: TransactionsService
    ) { }

    @Post()
    @UseGuards(AuthGuard)
    @FormDataRequest()
    @ApiConsumes("multipart/form-data")
    @ApiOperation({ summary: "create an transaction" })
    @ApiCreatedResponse({ status: "2XX" })
    @ApiBearerAuth()
    async create(
        @Body() createTransactionDto: CreateTransactionDto,
        @Req() req: Request
    ): Promise<void> {
        await this.transactionsService.create(req["user"]["sub"], createTransactionDto)
    }

    @Get("my-transactions")
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: "get current user transactions" })
    @ApiOkResponse({ status: "2XX", type: TransactionsSerializer, isArray: true })
    @ApiQuery({ name: "paging[limit]", type: Number, required: false })
    @ApiQuery({ name: "paging[offset]", type: Number, required: false })
    @ApiQuery({ name: "query[status]", enum: ETransactionStatus, required: false })
    @ApiBearerAuth()
    async findMyTransactions(
        @Query("paging") pagingDto: PagingDto = { limit: 10, offset: 0 },
        @Query("query") findAllQueryDto: FindAllQueryDto,
        @Req() req: Request
    ): Promise<TransactionsSerializer[]> {
        return plainToInstance(
            TransactionsSerializer,
            await this.transactionsService.findAll(pagingDto, { ...findAllQueryDto, userId: req["user"]["sub"] })
        )
    }

    @Get()
    @Roles(ERoles.SuperAdmin, ERoles.Admin)
    @UseGuards(AuthGuard, RoleGuard)
    @ApiOperation({ summary: "get all transactions" })
    @ApiOkResponse({ status: "2XX", type: TransactionsSerializer, isArray: true })
    @ApiQuery({ name: "paging[limit]", type: Number, required: false })
    @ApiQuery({ name: "paging[offset]", type: Number, required: false })
    @ApiQuery({ name: "query[status]", enum: ETransactionStatus, required: false })
    @ApiQuery({ name: "query[userId]", type: Number, required: false })
    @ApiBearerAuth()
    async findAll(@Query() pagingDto: PagingDto): Promise<TransactionsSerializer[]> {
        return plainToInstance(
            TransactionsSerializer,
            await this.transactionsService.findAll(pagingDto)
        )
    }

    @Get(":id")
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: "get one transaction by id" })
    @ApiOkResponse({ status: "2XX", type: TransactionsSerializer })
    @ApiParam({ name: "id", type: Number })
    @ApiBearerAuth()
    async findOneById(@Param("id", ParseIntPipe) id: number): Promise<TransactionsSerializer> {
        return plainToInstance(
            TransactionsSerializer,
            await this.transactionsService.findOneById(id)
        )
    }

    @Put(":id")
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: "update one transaction by id" })
    @ApiOkResponse({ status: "2XX" })
    @ApiParam({ name: "id", type: Number })
    @ApiBearerAuth()
    async updateOneById(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateTransactionsDto: UpdateTransactionDto
    ): Promise<void> {
        await this.transactionsService.updateOneById(id, updateTransactionsDto)
    }

    @Delete(":id")
    @ApiOperation({ summary: "delete one transaction by id" })
    @ApiOkResponse({ status: "2XX" })
    @ApiParam({ name: "id", type: Number })
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async deleteOneById(@Param("id", ParseIntPipe) id: number): Promise<void> {
        await this.transactionsService.deleteOneById(id)
    }

}