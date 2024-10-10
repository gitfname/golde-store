import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UserService,
  ) { }

  async signUpOrLogin(phone: string): Promise<LoginResponseDto> {
    const user = await this.usersService.findOneByPhone(phone)

    if (typeof user === "boolean") {
      const createdUser = await this.usersService.createUser({ phone })

      return {
        access_token: await this.jwtService.signAsync({
          user: { sub: createdUser.id },
        })
      }
    }

    return {
      access_token: await this.jwtService.signAsync({
        user: { sub: user.id },
      })
    }
  }

  // async login(email: string, password: string) {
  //   const user = await this.userService.findOneByEmail(email);

  //   if (!user) throw new BadRequestException('wrong credentials');

  //   if (await compare(password, user.password)) {
  //     return {
  //       access_token: await this.jwtService.signAsync({
  //         user: { sub: user.id, email: user.email },
  //       }),
  //     };
  //   }

  //   throw new BadRequestException('wrong credentials');
  // }

  // async signUp(createUserDto: CreateUserDto): Promise<User> {
  //   const user = await this.userService.createUser(createUserDto);
  //   return user;
  // }
}
