import { Controller, Post, Get, Delete, Query, UseGuards, Req, ParseIntPipe } from "@nestjs/common"
import { ShoppingCartService } from "./shopping-cart.service";
import { ShoppingCartSerializer } from "./serializer";
import { AuthGuard, RoleGuard } from "src/common/guards";
import { type Request } from "express"
import { plainToInstance } from "class-transformer";
import { Roles } from "src/common/rbac/roles.decorator";
import { ERoles } from "src/common/rbac/user-roles.enum";
import { PagingDto } from "src/common/nestjs-typeorm-query/paging";
import { FindAllQueryDto } from "./dto";
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags } from "@nestjs/swagger";

@Controller("shopping-carts")
@ApiTags("Shopping Cart")
export class ShoppingCartController {

    constructor(
        private readonly shoppingCartService: ShoppingCartService
    ) { }

    @ApiOkResponse({ status: "2XX", type: ShoppingCartSerializer })
    @ApiBearerAuth()
    @Get("my-cart")
    @UseGuards(AuthGuard)
    async findMyCart(@Req() req: Request): Promise<ShoppingCartSerializer> {
        return plainToInstance(
            ShoppingCartSerializer,
            await this.shoppingCartService.findOneByUserId(req["user"]["sub"])
        )
    }

    @Get()
    @Roles(ERoles.SuperAdmin, ERoles.Admin)
    @UseGuards(AuthGuard, RoleGuard)
    @ApiOkResponse({ status: "2XX", type: ShoppingCartSerializer, isArray: true })
    @ApiQuery({ name: "paging[limit]", type: Number, required: false })
    @ApiQuery({ name: "paging[offset]", type: Number, required: false })
    @ApiQuery({ name: "query[userId]", type: Number, required: false })
    @ApiBearerAuth()
    async findAll(
        @Query("paging") pagingDto: PagingDto = { limit: 10, offset: 0 },
        @Query("query") findAllQueryDto: FindAllQueryDto,
    ): Promise<{ data: ShoppingCartSerializer[], count: number }> {
        const carts = await this.shoppingCartService.findAll(pagingDto, findAllQueryDto)

        const serializedCarts = plainToInstance(
            ShoppingCartSerializer,
            carts[0]
        )

        return {
            data: serializedCarts,
            count: carts[1]
        }
    }

    @Post("add-product")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiQuery({ name: "productId", type: Number })
    async addProduct(
        @Req() req: Request,
        @Query("productId", ParseIntPipe) productId: number
    ): Promise<void> {
        await this.shoppingCartService.addProduct(req["user"]["sub"], productId)
    }

    @Delete("remove-product")
    @ApiBearerAuth()
    @ApiQuery({ name: "productId", type: Number })
    @UseGuards(AuthGuard)
    async removeProduct(
        @Req() req: Request,
        @Query("productId", ParseIntPipe) productId: number
    ): Promise<void> {
        await this.shoppingCartService.removeProduct(req["user"]["sub"], productId)
    }

    @Delete("empty-my-cart")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    async emptyShoppingCart(
        @Req() req: Request
    ): Promise<void> {
        await this.shoppingCartService.emptyUserShoppingCart(req["user"]["sub"])
    }

}
