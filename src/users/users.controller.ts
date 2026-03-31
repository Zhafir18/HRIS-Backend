import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from 'src/entity/users.entity';
import { PaginatedResult } from 'src/common/pagination.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { RolesDecorator } from 'src/auth/roles.decorator';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator('Admin')
  @Get()
  findAll(
    @Query()
    query: {
      username?: string;
      email?: string;
      roleId?: string;
      search?: string;
      page?: string;
      limit?: string;
    },
  ): Promise<PaginatedResult<Users>> {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '10', 10);

    if (query.username || query.email || query.roleId || query.search) {
      return this.usersService.findFiltered(query, page, limit);
    }
    return this.usersService.findAll(page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  findMe(@Req() req: Request): Promise<Users> {
    const userId = (req as any).user.userId;
    return this.usersService.findOne(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator('Admin')
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Users> {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator('Admin')
  @Post()
  create(@Body() user: Partial<Users>): Promise<Users> {
    return this.usersService.create(user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator('Admin')
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() user: Partial<Users>,
  ): Promise<Users> {
    return this.usersService.update(id, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator('Admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
