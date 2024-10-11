import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard, RoleGuard } from 'src/common/guards';
import { Roles } from 'src/common/rbac/roles.decorator';
import { ERoles } from 'src/common/rbac/user-roles.enum';
import { PagingDto } from 'src/common/nestjs-typeorm-query/paging';
import { ProductsSerializer } from './serializer';
import { plainToInstance } from 'class-transformer';
import { FormDataRequest } from "nestjs-form-data"
import { FindAllQueryDto } from './dto';
import { ApiBearerAuth, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@Controller('products')
@ApiTags("Products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  @Roles(ERoles.SuperAdmin, ERoles.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  @FormDataRequest()
  @ApiOperation({ summary: "create an product" })
  @ApiCreatedResponse({ status: "2XX" })
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  async create(@Body() createProductDto: CreateProductDto) {
    await this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: "get all products" })
  @ApiOkResponse({ status: "2XX", type: ProductsSerializer, isArray: true })
  @ApiQuery({ name: "paging[limit]", type: Number, required: false })
  @ApiQuery({ name: "paging[offset]", type: Number, required: false })
  @ApiQuery({ name: "query[title]", type: String, required: false })
  @ApiQuery({ name: "query[isActive]", type: Boolean, required: false })
  @ApiQuery({ name: "query[isAvailable]", type: Boolean, required: false })
  @ApiQuery({ name: "query[minPrice]", type: Number, required: false })
  @ApiQuery({ name: "query[maxPrice]", type: Number, required: false })
  @ApiQuery({ name: "query[minUsedGoldGrams]", type: Number, required: false })
  @ApiQuery({ name: "query[maxUsedGoldGrams]", type: Number, required: false })
  @ApiQuery({ name: "query[minFee]", type: Number, required: false })
  @ApiQuery({ name: "query[maxFee]", type: Number, required: false })
  async findAll(
    @Query("paging") pagingDto: PagingDto = { limit: 10, offset: 0 },
    @Query("query") findAllQueryDto: FindAllQueryDto
  ): Promise<{ data: ProductsSerializer[], count: number }> {
    const products = await this.productsService.findAll(pagingDto, findAllQueryDto);

    const serializedProducts = plainToInstance(
      ProductsSerializer,
      products[0]
    )

    return {
      data: serializedProducts,
      count: products[1]
    }
  }

  @Get(':id')
  @ApiOperation({ summary: "get a product by id" })
  @ApiOkResponse({ status: "2XX", type: ProductsSerializer })
  @ApiParam({ name: "id", type: Number })
  async findOne(@Param('id', ParseIntPipe) id: string): Promise<ProductsSerializer> {
    return plainToInstance(
      ProductsSerializer,
      await this.productsService.findOne(+id)
    )
  }

  @Put(':id')
  @Roles(ERoles.SuperAdmin, ERoles.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  @FormDataRequest()
  @ApiOperation({ summary: "update a product by id" })
  @ApiOkResponse({ status: "2XX" })
  @ApiParam({ name: "id", type: Number })
  @ApiConsumes("multipart/form-data")
  @ApiBearerAuth()
  async update(@Param('id', ParseIntPipe) id: string, @Body() updateProductDto: UpdateProductDto): Promise<void> {
    await this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @Roles(ERoles.SuperAdmin, ERoles.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  @ApiOperation({ summary: "delete a product by id" })
  @ApiOkResponse({ status: "2XX" })
  @ApiParam({ name: "id", type: Number })
  @ApiBearerAuth()
  async remove(@Param('id', ParseIntPipe) id: string): Promise<void> {
    await this.productsService.remove(+id);
  }
}
