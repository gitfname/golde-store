import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import { ShoppingCart } from "./shopping-cart.entity";
import { UserService } from "src/common/users";
import { ProductsService } from "../products/products.service";
import { PagingDto } from "src/common/nestjs-typeorm-query/paging";
import { FindAllQueryDto } from "./dto";

@Injectable()
export class ShoppingCartService {

    constructor(
        @InjectRepository(ShoppingCart) private readonly shoppingCartRepository: Repository<ShoppingCart>,
        private readonly usersService: UserService,
        private readonly productsService: ProductsService

    ) { }

    async create(userId: number): Promise<ShoppingCart> {
        const user = await this.usersService.findOneByID(userId)
        const shoppingCart = this.shoppingCartRepository.create({
            user
        })
        await this.shoppingCartRepository.save(shoppingCart)
        return shoppingCart
    }

    async findAll(pagingDto: PagingDto, findAllQueryDto?: FindAllQueryDto): Promise<[ShoppingCart[], number]> {
        const where: FindOptionsWhere<ShoppingCart> = {
            user: {
                id: findAllQueryDto?.userId ?? undefined
            }
        }

        return this.shoppingCartRepository.findAndCount({
            where,
            take: pagingDto.limit,
            skip: pagingDto.offset
        })
    }

    async findOneByUserId(userId: number): Promise<ShoppingCart> {
        const shoppingCart = await this.shoppingCartRepository.findOne({
            where: {
                user: {
                    id: userId
                }
            },
            relations: { user: true, products: true }
        })

        if (!shoppingCart) {
            const shoppingCart = await this.create(userId)
            return shoppingCart
        }

        return shoppingCart
    }

    async emptyUserShoppingCart(userId: number): Promise<void> {
        const updatedCart = await this.shoppingCartRepository.update({
            user: {
                id: userId
            }
        }, {
            products: []
        })

        if (updatedCart.affected === 0) throw new BadRequestException("failed to empty the cart")
    }

    async addProduct(userId: number, productId: number): Promise<void> {
        const product = await this.productsService.findOne(productId)
        const cart = await this.findOneByUserId(userId)
        cart.products.push(product)
        await this.shoppingCartRepository.save(cart)
    }

    async removeProduct(userId: number, productId: number): Promise<void> {
        const cart = await this.findOneByUserId(userId)
        cart.products = cart.products.filter(product => product.id !== productId)
        await this.shoppingCartRepository.save(cart)
    }

}