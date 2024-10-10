import {
  Controller,
  Get,
  Delete,
  Param,
  Body,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UsersSerializer } from './dto/user.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard, RoleGuard } from '../guards';
import { Roles } from '../rbac/roles.decorator';
import { ERoles } from '../rbac/user-roles.enum';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiSecurity, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags("Users")
export class UserController {
  constructor(private readonly usersService: UserService) { }

  @Get('profile')
  @ApiOperation({ summary: "get my profile details" })
  @ApiBearerAuth()
  @ApiOkResponse({ status: "2XX", type: UsersSerializer })
  @UseGuards(AuthGuard)
  async myProfile(@Req() req: Request): Promise<UsersSerializer> {
    const userId = req['user']['sub'];
    return plainToInstance(UsersSerializer, await this.usersService.findOneByID(userId), {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  @Roles(ERoles.SuperAdmin, ERoles.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  @ApiOperation({ summary: "find a user by id", description: "Roles : super-admin , admin" })
  @ApiOkResponse({ status: "2XX", type: UsersSerializer })
  async findOneById(@Param('id') id: number): Promise<UsersSerializer> {
    return plainToInstance(UsersSerializer, await this.usersService.findOneByID(+id), {
      excludeExtraneousValues: true,
    });
  }

  @Put(':id')
  @Roles(ERoles.SuperAdmin)
  @UseGuards(AuthGuard, RoleGuard)
  @ApiOperation({ summary: "update a user by id", description: "Roles : super-admin" })
  @ApiParam({ name: "id", type: Number })
  @ApiOkResponse({ status: "2XX", type: null })
  @ApiBearerAuth()
  async updateOneById(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<void> {
    await this.usersService.updateOneById(id, updateUserDto)
  }

  @Delete(':id')
  @Roles(ERoles.SuperAdmin)
  @UseGuards(AuthGuard, RoleGuard)
  @ApiOperation({ summary: "delete a user by id", description: "Roles : super-admin" })
  @ApiParam({ name: "id", type: Number })
  @ApiOkResponse({ status: "2XX", type: null })
  @ApiBearerAuth()
  async deleteById(@Param('id') id: string): Promise<void> {
    await this.usersService.removeOneById(+id);
  }
}
