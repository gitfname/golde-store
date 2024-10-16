import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductOrders } from "./product-orders.entity";
import { Repository } from "typeorm";
import { UserService } from "src/common/users";
import { ShoppingCartService } from "../shopping-cart/shopping-cart.service";
import { EProductOrdersStatus } from "./product-orders.enum";
import { PagingDto } from "src/common/nestjs-typeorm-query/paging";
import { UpdateProductOrderDto } from "./dto";
import { ProductsService } from "../products/products.service";

@Injectable()
export class ProductOrdersService {

    constructor(
        @InjectRepository(ProductOrders) private readonly productOrdersRepository: Repository<ProductOrders>,
        private readonly usersService: UserService,
        private readonly shoppingCartService: ShoppingCartService,
        private readonly productsService: ProductsService
    ) { }

    async create(userId: number): Promise<void> {
        const user = await this.usersService.findOneByID(userId)
        const shoppingCart = await this.shoppingCartService.findOneByUserId(userId)

        if (shoppingCart.products?.length === 0) {
            throw new BadRequestException("shopping-cart is empty")
        }

        let productsPrice = "0.0000"

        // calculate all of the products price plus their fee
        try {
            shoppingCart.products.forEach(product => {
                const amountOfGold = parseFloat(product.amountOfGoldUsed as string)
                productsPrice = (
                    (
                        parseFloat(productsPrice)
                        +
                        amountOfGold + (amountOfGold * (product.fee / 100))
                    )
                ).toFixed(4)
            })
        } catch (error) {
            throw new InternalServerErrorException("something went wrong while calculating products price")
        }

        if (parseFloat(productsPrice) > parseFloat(user.gold)) {
            throw new BadRequestException("insufficient gold balance")
        }

        try {
            await this.usersService.updateOne(userId, {
                gold: (parseFloat(user.gold) - parseFloat(productsPrice)).toFixed(4)
            })
        } catch (error) {
            throw new InternalServerErrorException("something went wrong while decreasing user gold balance")
        }

        try {
            const products = await this.productsService.query({
                filter: {
                    id: {
                        in: shoppingCart.products.map(product => product.id)
                    }
                }
            })

            console.log("found products :")
            console.log(products)

            const productOrder = this.productOrdersRepository.create({
                user,
                products,
                price: productsPrice,
                status: EProductOrdersStatus.Pending
            })

            await this.productOrdersRepository.save(productOrder)

            await this.shoppingCartService.emptyUserShoppingCart(userId)
        } catch (error) {
            const user = await this.usersService.findOneByID(userId)

            await this.usersService.updateOne(userId, {
                gold: (parseFloat(user.gold) + parseFloat(productsPrice)).toFixed(4)
            })

            console.log(error)

            throw new InternalServerErrorException("something went wrong while creating product-order record")
        }
    }

    async findAll(pagingDto: PagingDto): Promise<[ProductOrders[], number]> {
        return this.productOrdersRepository.findAndCount({
            take: pagingDto.limit,
            skip: pagingDto.offset,
            relations: { user: true, products: true }
        })
    }

    async findOneById(productOrderId: number): Promise<ProductOrders> {
        const order = await this.productOrdersRepository.findOne({
            where: { id: productOrderId },
            relations: { user: true, products: true }
        })
        if (!order) throw new NotFoundException("product-order not found")
        return order
    }

    async updateOneById(productOrderId: number, updateProductOrderDto: UpdateProductOrderDto): Promise<void> {
        const productOrder = await this.findOneById(productOrderId)

        const updatedProductOrder = await this.productOrdersRepository.update({ id: productOrderId }, updateProductOrderDto)

        if (
            updateProductOrderDto.status === EProductOrdersStatus.Pending
            &&
            (
                productOrder.status === EProductOrdersStatus.Accepted
                ||
                productOrder.status === EProductOrdersStatus.Rejected
            )
        ) {
            await this.usersService.updateOne(productOrder.user.id, {
                gold: (parseFloat(productOrder.user.gold) - parseFloat(productOrder.price)).toFixed(4)
            })
        }
        else if (
            updateProductOrderDto.status === EProductOrdersStatus.Rejected
            &&
            (
                productOrder.status === EProductOrdersStatus.Pending
                ||
                productOrder.status === EProductOrdersStatus.Accepted
            )
        ) {
            await this.usersService.updateOne(productOrder.user.id, {
                gold: (parseFloat(productOrder.user.gold) + parseFloat(productOrder.price)).toFixed(4)
            })
        }
        else if (
            updateProductOrderDto.status === EProductOrdersStatus.Accepted
            &&
            productOrder.status === EProductOrdersStatus.Rejected
        ) {
            await this.usersService.updateOne(productOrder.user.id, {
                gold: (parseFloat(productOrder.user.gold) - parseFloat(productOrder.price)).toFixed(4)
            })
        }
    }

    async deleteOneById(productOrderId: number): Promise<void> {
        const productOrder = await this.findOneById(productOrderId)

        const deletedProductOrder = await this.productOrdersRepository.delete({ id: productOrderId })
        if (deletedProductOrder.affected === 0) throw new NotFoundException("product-order not found")

        if (productOrder.status === EProductOrdersStatus.Pending) {
            try {
                await this.usersService.updateOne(productOrder.user.id, {
                    gold: (parseFloat(productOrder.user.gold) + parseFloat(productOrder.price)).toFixed(4)
                })
            } catch (error) {
                throw new InternalServerErrorException("something went wrong while increasing user gold balance")
            }
        }
    }

}