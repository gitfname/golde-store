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

@Injectable()
export class UserService extends TypeOrmQueryService<User> {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
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

    return savedUser;
  }

  async findAll(): Promise<User[]> {
    const users = await this.usersRepository.find();
    return users;
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
