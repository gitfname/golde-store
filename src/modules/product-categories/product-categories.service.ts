import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductCategories } from "./product-categories.entity";
import { TypeOrmQueryService } from "@ptc-org/nestjs-query-typeorm"
import { PagingDto } from "src/common/nestjs-typeorm-query/paging";

@Injectable()
export class ProductCategoriesService extends TypeOrmQueryService<ProductCategories> {
    constructor(
        @InjectRepository(ProductCategories) private readonly productCategoriesRepository: Repository<ProductCategories>
    ) {
        super(productCategoriesRepository)
    }


    async findAllAndCount(pagingDto: PagingDto): Promise<[ProductCategories[], number]> {
        return this.productCategoriesRepository.findAndCount({
            take: pagingDto.limit,
            skip: pagingDto.offset
        })
    }

    async findOneById(id: number): Promise<ProductCategories> {
        const productCategory = await this.findById(id)
        if (!productCategory) throw new NotFoundException("category not found")
        return productCategory
    }
}