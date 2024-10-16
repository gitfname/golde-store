import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm";
import { ShoppingCart } from "./shopping-cart.entity";
import { UserModule } from "src/common/users";
import { ProductsModule } from "../products/products.module";
import { ShoppingCartService } from "./shopping-cart.service";
import { ShoppingCartController } from "./shopping-cart.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([ShoppingCart]),
        UserModule,
        ProductsModule
    ],
    providers: [ShoppingCartService],
    controllers: [ShoppingCartController],
    exports: [ShoppingCartService]
})
export class ShoppingCartModule { }