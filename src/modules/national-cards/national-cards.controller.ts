import { Controller, Post, Body, UseGuards, Req, Get, Put, Delete, Param, Query, ParseIntPipe } from "@nestjs/common"
import { NationalCardService } from "./national-cards.service"
import { FormDataRequest } from "nestjs-form-data"
import { CreateNationalCardDto, FindAllQueryDto, UpdateNationalCardDto } from "./dto"
import { AuthGuard, RoleGuard } from "src/common/guards"
import { type Request } from "express"
import { NationalCardsSerializer } from "./serializer"
import { plainToInstance } from "class-transformer"
import { PagingDto } from "src/common/nestjs-typeorm-query/paging"
import { Roles } from "src/common/rbac/roles.decorator"
import { ERoles } from "src/common/rbac/user-roles.enum"
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger"
import { ENationalCardStatus } from "./national-cards.enum"

@Controller("national-cards")
@ApiTags("National Cards")
export class NationalCardsController {

    constructor(
        private readonly nationalCardsService: NationalCardService
    ) { }

    @Post()
    @FormDataRequest()
    @UseGuards(AuthGuard)
    @ApiConsumes("multipart/form-data")
    @ApiOperation({ summary: "create an national card" })
    @ApiCreatedResponse({ status: "2XX", type: null })
    @ApiBearerAuth()
    async create(@Body() createNationalCardDto: CreateNationalCardDto, @Req() req: Request): Promise<void> {
        await this.nationalCardsService.create(req["user"]["sub"], createNationalCardDto)
    }

    @Get("my-card")
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: "get current user national-card" })
    @ApiOkResponse({ status: "2XX", type: NationalCardsSerializer })
    @ApiBearerAuth()
    async findMyPendingCards(@Req() req: Request): Promise<NationalCardsSerializer> {
        return plainToInstance(
            NationalCardsSerializer,
            await this.nationalCardsService.findOneByUserId(req["user"]["sub"])
        )
    }

    @Get()
    @Roles(ERoles.SuperAdmin, ERoles.Admin)
    @UseGuards(AuthGuard, RoleGuard)
    @ApiOperation({ summary: "get all national-cards" })
    @ApiOkResponse({ status: "2XX", type: NationalCardsSerializer, isArray: true })
    @ApiBearerAuth()
    @ApiQuery({ name: "paging[limit]", type: Number, required: false })
    @ApiQuery({ name: "paging[offset]", type: Number, required: false })
    @ApiQuery({ name: "query[userId]", type: Number, required: false })
    @ApiQuery({ name: "query[status]", enum: ENationalCardStatus, required: false })
    async findAll(
        @Query("paging") pagingDto: PagingDto = { limit: 10, offset: 0 },
        @Query("query") queryDto: FindAllQueryDto
    ): Promise<NationalCardsSerializer[]> {
        return plainToInstance(
            NationalCardsSerializer,
            await this.nationalCardsService.findAll(pagingDto, queryDto)
        )
    }

    @Put(":id")
    @Roles(ERoles.SuperAdmin, ERoles.Admin)
    @UseGuards(AuthGuard, RoleGuard)
    async updateOneById(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateNationalCardDto: UpdateNationalCardDto
    ): Promise<void> {
        await this.nationalCardsService.updateOneById(id, updateNationalCardDto)
    }

    @Delete(":id")
    @Roles(ERoles.SuperAdmin, ERoles.Admin)
    @UseGuards(AuthGuard, RoleGuard)
    async deleteOneById(@Param("id", ParseIntPipe) id: number): Promise<void> {
        await this.nationalCardsService.removeOneById(id)
    }

}