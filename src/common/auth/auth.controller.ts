import { Controller, Post, Body } from '@nestjs/common';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { CreateUserDto, UsersSerializer } from '../users/dto';
import { plainToClass } from 'class-transformer';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('authenticate')
  // async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
  //   return await this.authService.login(loginDto.email, loginDto.password);
  // }


}
