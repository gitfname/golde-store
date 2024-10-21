import {
  Controller,
  Get,
  Delete,
  Param,
  Body,
  Put,
  Req,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UsersSerializer } from './dto/user.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateUserDto } from './dto/update-user.dto';
import { AccessControllerGuard, AuthGuard, RoleGuard } from '../guards';
import { Roles } from '../rbac/roles.decorator';
import { ERoles } from '../rbac/user-roles.enum';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { PagingDto } from '../nestjs-typeorm-query/paging';
import { SetAccessControllerRules } from '../decorators';
import { Filter } from "@ptc-org/nestjs-query-core"
import { User } from './user.entity';

@Controller('users')
@ApiTags("Users")
export class UserController {
  constructor(private readonly usersService: UserService) { }

  @Get()
  @Roles(ERoles.SuperAdmin, ERoles.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  @ApiOperation({ summary: "find all users" })
  @ApiBearerAuth()
  @ApiQuery({ name: "paging[limit]", type: Number, required: false })
  @ApiQuery({ name: "paging[offset]", type: Number, required: false })
  async findAll(
    @Query("paging") pagingDto: PagingDto = { limit: 10, offset: 0 }
  ): Promise<{ data: UsersSerializer[], count: number }> {
    const users = await this.usersService.findAll(pagingDto)

    const serializedUsers = plainToInstance(
      UsersSerializer,
      users[0]
    )

    return {
      data: serializedUsers,
      count: users[1]
    }
  }

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

  @Put("profile")
  @SetAccessControllerRules({
    entityClass: "user",
    filter: {
      id: {
        eq: "{{CURRENT_USER}}" as any as number
      }
    } as Filter<User>
  })
  @UseGuards(AuthGuard, AccessControllerGuard)
  @ApiOperation({summary: "update my profile"})
  @ApiBearerAuth()
  async updateMyProfile(
    @Req() req: Request,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<void> {
    await this.usersService.updateOne(req["user"]["sub"], updateUserDto)
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

  @Get(":id/accept-details")
  @Roles(ERoles.SuperAdmin, ERoles.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  @ApiOperation({ summary: "accept user details" })
  @ApiParam({ name: "id", type: Number })
  async acceptUserDetails(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.usersService.updateOne(id, { isDetailsAccepted: true })
  }

  @Get(":id/reject-details")
  @Roles(ERoles.SuperAdmin, ERoles.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  @ApiOperation({ summary: "reject user details" })
  @ApiParam({ name: "id", type: Number })
  async rejectUserDetails(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.usersService.updateOne(id, { isDetailsAccepted: false })
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
