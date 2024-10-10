import { Body, Controller, Req, Post, UseGuards, Get, Query, Delete, Param, ParseIntPipe } from "@nestjs/common";
import { BankAccountsService } from "./bank-accounts.service";
import { CreateBankAccountDto } from "./dto";
import { type Request } from "express"
import { AuthGuard, RoleGuard } from "src/common/guards";
import { BankAccountsSerializer } from "./serializer";
import { PagingDto } from "src/common/nestjs-typeorm-query/paging";
import { plainToInstance } from "class-transformer";
import { Roles } from "src/common/rbac/roles.decorator";
import { ERoles } from "src/common/rbac/user-roles.enum";
import { FindAllQueryDto } from "./dto/findAll.query.dto";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";

@Controller('bank-accounts')
@ApiTags("Bank Accounts")
export class BankAccountsController {

    constructor(
        private readonly bankAccountsService: BankAccountsService
    ) { }

    @Post()
    @ApiOperation({ summary: "create bank account" })
    @ApiCreatedResponse({ status: "2XX", type: null })
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async create(
        @Body() createBankAccountDto: CreateBankAccountDto,
        @Req() req: Request
    ): Promise<void> {
        await this.bankAccountsService.create(req["user"]["sub"], createBankAccountDto)
    }

    @Get("my-accounts")
    @ApiOperation({ summary: "get all of the current user bank accounts" })
    @ApiOkResponse({ status: "2XX", type: BankAccountsSerializer, isArray: true })
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async findMyBankAccounts(
        @Query() pagingDto: PagingDto,
        @Req() req: Request
    ): Promise<BankAccountsSerializer[]> {
        return plainToInstance(
            BankAccountsSerializer,
            await this.bankAccountsService.findAll(pagingDto, { userId: req["user"]["sub"] })
        )
    }

    @Get()
    @Roles(ERoles.SuperAdmin, ERoles.Admin)
    @UseGuards(AuthGuard, RoleGuard)
    @ApiOperation({ summary: "get all of bank accounts" })
    @ApiOkResponse({ status: "2XX", type: BankAccountsSerializer, isArray: true })
    @ApiQuery({ name: "paging[limit]", required: false, type: Number })
    @ApiQuery({ name: "paging[offset]", required: false, type: Number })
    @ApiQuery({ name: "query[userId]", required: false, type: Number })
    @ApiBearerAuth()
    async findAll(
        @Query("paging") pagingDto: PagingDto,
        @Query("query") findAllQueryDto: FindAllQueryDto
    ): Promise<BankAccountsSerializer[]> {
        return plainToInstance(
            BankAccountsSerializer,
            await this.bankAccountsService.findAll(pagingDto, findAllQueryDto)
        )
    }

    @Delete(":id")
    @ApiOperation({ summary: "delete an bank account based on it's id" })
    @ApiOkResponse({ status: "2XX", type: null })
    @ApiBearerAuth()
    @Roles(ERoles.SuperAdmin, ERoles.Admin)
    @UseGuards(AuthGuard, RoleGuard)
    async deleteOneById(@Param("id", ParseIntPipe) id: number): Promise<void> {
        await this.bankAccountsService.deleteOneById(id)
    }

}