import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductOrders } from "./product-orders.entity";
import { UserModule } from "src/common/users";
import { ShoppingCartModule } from "../shopping-cart/shopping-cart.module";
import { ProductOrdersService } from "./product-orders.service";
import { ProductOrdersController } from "./product-orders.controller";
import { NestjsQueryTypeOrmModule } from "@ptc-org/nestjs-query-typeorm"
import { ProductsModule } from "../products/products.module";

@Module({
    imports: [
        NestjsQueryTypeOrmModule.forFeature([ProductOrders]),
        UserModule,
        ShoppingCartModule,
        ProductsModule
    ],
    providers: [ProductOrdersService],
    controllers: [ProductOrdersController],
    exports: [ProductOrdersService]
})
export class ProductOrdersModule { }