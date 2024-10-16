import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { ShoppingCart } from 'src/modules/shopping-cart/shopping-cart.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ShoppingCart]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
