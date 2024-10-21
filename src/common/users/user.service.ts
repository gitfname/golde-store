import {
  Injectable,
  BadRequestException,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TypeOrmQueryService } from '@ptc-org/nestjs-query-typeorm';
import { ERoles } from '../rbac/user-roles.enum';
import { ShoppingCart } from 'src/modules/shopping-cart/shopping-cart.entity';
import { PagingDto } from '../nestjs-typeorm-query/paging';

@Injectable()
export class UserService extends TypeOrmQueryService<User> {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(ShoppingCart) private readonly shoppingCartRepository: Repository<ShoppingCart>,
  ) {
    super(usersRepository)
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const isPhoneExist = await this.usersRepository.findOneBy({ phone: createUserDto.phone })

    if (isPhoneExist) throw new BadRequestException("phone already has been used")

    const user = this.usersRepository.create(createUserDto);

    const isFirstUser = await this.usersRepository.count({ take: 3 })

    if (isFirstUser === 0) {
      user.role = ERoles.SuperAdmin
    }
    else {
      user.role = ERoles.User
    }

    const savedUser = await this.usersRepository.save(user);

    const shoppingCart = this.shoppingCartRepository.create({
      user: savedUser
    })

    await this.shoppingCartRepository.save(shoppingCart)

    return savedUser;
  }

  async findAll(pagingDto: PagingDto): Promise<[User[], number]> {
    return this.usersRepository.findAndCount({
      take: pagingDto.limit,
      skip: pagingDto.offset
    })
  }

  async findOneByID(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  async findOneByPhone(phone: string): Promise<User | boolean> {
    const user = await this.usersRepository.findOneBy({ phone });
    if (!user) return false
    return user
  }

  async updateOneById(id: number, updateUserDto: UpdateUserDto): Promise<void> {
    const updatedUser = await this.usersRepository.update({ id }, updateUserDto)
    if (updatedUser.affected === 0) throw new NotFoundException("user not found")
  }

  async removeOneById(id: number): Promise<void> {
    const deletedUser = await this.usersRepository.delete({ id })
    if (deletedUser.affected === 0) throw new NotFoundException("user not found")
  }
}
