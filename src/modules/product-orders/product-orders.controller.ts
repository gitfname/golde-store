import { Controller, Post, Get, Put, Delete, UseGuards, Req, Query, Param, ParseIntPipe, Body } from "@nestjs/common"
import { ProductOrdersService } from "./product-orders.service";
import { AccessControllerGuard, AuthGuard, RoleGuard } from "src/common/guards";
import { type Request } from "express"
import { ProductOrdersSerializer } from "./serializer";
import { PagingDto } from "src/common/nestjs-typeorm-query/paging";
import { plainToInstance } from "class-transformer";
import { ERoles } from "src/common/rbac/user-roles.enum";
import { Roles } from "src/common/rbac/roles.decorator";
import { SetAccessControllerRules } from "src/common/decorators";
import { Filter } from "@ptc-org/nestjs-query-core";
import { ProductOrders } from "./product-orders.entity";
import { UpdateProductOrderDto } from "./dto";
import { ApiBearerAuth, ApiOkResponse, ApiParam, ApiTags } from "@nestjs/swagger";

@Controller("product-orders")
@ApiTags("Product Orders")
export class ProductOrdersController {

    constructor(
        private readonly productOrdersService: ProductOrdersService
    ) { }

    @Post()
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    async create(@Req() req: Request): Promise<void> {
        await this.productOrdersService.create(req["user"]["sub"])
    }

    @Get("my-orders")
    @UseGuards(AuthGuard)
    @ApiOkResponse({ status: "2XX", type: ProductOrdersSerializer, isArray: true })
    @ApiBearerAuth()
    async findMyOrders(
        @Query() pagingDto: PagingDto
    ): Promise<{ data: ProductOrdersSerializer[], count: number }> {
        const productOrders = await this.productOrdersService.findAll(pagingDto)

        const serializedProductOrders = plainToInstance(
            ProductOrdersSerializer,
            productOrders[0]
        )

        return {
            data: serializedProductOrders,
            count: productOrders[1]
        }
    }

    @Get("my-orders/:id")
    @SetAccessControllerRules({
        entityClass: "product-orders",
        filter: {
            user: {
                id: {
                    eq: "{{CURRENT_USER}}"
                }
            }
        } as Filter<ProductOrders>
    })
    @UseGuards(AuthGuard, AccessControllerGuard)
    @ApiOkResponse({ status: "2XX", type: ProductOrdersSerializer })
    @ApiBearerAuth()
    @ApiParam({ name: "id", type: Number })
    async findMyProductOrderById(
        @Param("id", ParseIntPipe) id: number
    ): Promise<ProductOrdersSerializer> {
        return plainToInstance(
            ProductOrdersSerializer,
            await this.productOrdersService.findOneById(id)
        )
    }

    @Get()
    @Roles(ERoles.SuperAdmin, ERoles.Admin)
    @UseGuards(AuthGuard, RoleGuard)
    @ApiOkResponse({ status: "2XX", type: ProductOrdersSerializer, isArray: true })
    @ApiBearerAuth()
    async findAll(@Query() pagingDto: PagingDto): Promise<{ data: ProductOrdersSerializer[], count: number }> {
        const productOrders = await this.productOrdersService.findAll(pagingDto)

        const serializedProductOrders = plainToInstance(
            ProductOrdersSerializer,
            productOrders[0]
        )

        return {
            data: serializedProductOrders,
            count: productOrders[1]
        }
    }

    @Put(":id")
    @Roles(ERoles.SuperAdmin, ERoles.Admin)
    @UseGuards(AuthGuard, RoleGuard)
    @ApiParam({ name: "id", type: Number })
    @ApiBearerAuth()
    async updateOneById(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateProductOrderDto: UpdateProductOrderDto
    ): Promise<void> {
        await this.productOrdersService.updateOneById(id, updateProductOrderDto)
    }

    @Delete(":id")
    @Roles(ERoles.SuperAdmin, ERoles.Admin)
    @UseGuards(AuthGuard, RoleGuard)
    @ApiParam({ name: "id", type: Number })
    @ApiBearerAuth()
    async deleteOneById(@Param("id", ParseIntPipe) id: number): Promise<void> {
        await this.productOrdersService.deleteOneById(id)
    }

}