import { Controller, Post, Get, Put, Delete, Param, UseGuards, Body, ParseIntPipe } from "@nestjs/common"
import { ProductCategoriesService } from "./product-categories.service"
import { Roles } from "src/common/rbac/roles.decorator"
import { ERoles } from "src/common/rbac/user-roles.enum"
import { AuthGuard, RoleGuard } from "src/common/guards"
import { CreateProductCategoryDto, UpdateProductCategoryDto } from "./dto"
import { PagingDto } from "src/common/nestjs-typeorm-query/paging"
import { plainToInstance } from "class-transformer"
import { ProductCategoriesSerializer } from "./serializer"
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger"

@Controller("product-categories")
@ApiTags("Product Categories")
export class ProductCategoriesController {

    constructor(
        private readonly productCategoriesService: ProductCategoriesService
    ) { }

    @Post()
    @Roles(ERoles.SuperAdmin, ERoles.Admin)
    @UseGuards(AuthGuard, RoleGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "create a category" })
    async create(@Body() createProductCategoryDto: CreateProductCategoryDto): Promise<void> {
        await this.productCategoriesService.createOne(createProductCategoryDto)
    }

    @Get()
    @ApiOperation({ summary: "find all categories" })
    @ApiQuery({ name: "paging[limit]", type: Number, required: false })
    @ApiQuery({ name: "paging[offset]", type: Number, required: false })
    async findAll(@Param() pagingDto: PagingDto = { limit: 15, offset: 0 }): Promise<{ data: ProductCategoriesSerializer[], count: number }> {
        const productCategories = await this.productCategoriesService.findAllAndCount(pagingDto)

        const serializedProductCategories = plainToInstance(
            ProductCategoriesSerializer,
            productCategories[0]
        )

        return {
            data: serializedProductCategories,
            count: productCategories[1]
        }
    }

    @Get(":id")
    async findOneById(@Param("id", ParseIntPipe) id: number): Promise<ProductCategoriesSerializer> {
        return plainToInstance(
            ProductCategoriesSerializer,
            await this.productCategoriesService.findById(id)
        )
    }

    @Put(":id")
    @Roles(ERoles.SuperAdmin, ERoles.Admin)
    @UseGuards(AuthGuard, RoleGuard)
    @ApiOperation({ summary: "update an product by id" })
    @ApiBearerAuth()
    @ApiParam({ name: "id", type: Number })
    async updateOneById(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateProductCategoryDto: UpdateProductCategoryDto
    ): Promise<void> {
        await this.productCategoriesService.updateOne(id, updateProductCategoryDto)
    }

    @Delete(":id")
    @Roles(ERoles.SuperAdmin, ERoles.Admin)
    @UseGuards(AuthGuard, RoleGuard)
    @ApiOperation({ summary: "delete an product by id" })
    @ApiBearerAuth()
    @ApiParam({ name: "id", type: Number })
    async deleteOneById(@Param("id", ParseIntPipe) id: number): Promise<void> {
        await this.productCategoriesService.deleteOne(id)
    }

}