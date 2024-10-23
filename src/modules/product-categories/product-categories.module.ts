import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductCategories } from "./product-categories.entity";
import { UserModule } from "src/common/users";
import { ProductCategoriesService } from "./product-categories.service";
import { ProductCategoriesController } from "./product-categories.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([ProductCategories]),
        UserModule
    ],
    providers: [ProductCategoriesService],
    controllers: [ProductCategoriesController],
    exports: [ProductCategoriesService]
})
export class ProductCategoriesModule { }