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
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { Roles } from 'src/entity/roles.entity';
import { PaginatedResult } from 'src/common/pagination.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { RolesDecorator } from 'src/auth/roles.decorator';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator('Admin')
  @Get()
  findAll(
    @Query() query: { name?: string; page?: string; limit?: string },
  ): Promise<PaginatedResult<Roles>> {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '10', 10);

    if (query.name) {
      return this.rolesService.findFiltered(query, page, limit);
    }
    return this.rolesService.findAll(page, limit);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator('Admin')
  @Get('dropdown')
  findRoles(): Promise<Roles[]> {
    return this.rolesService.findRoles();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator('Admin')
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Roles> {
    return this.rolesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator('Admin')
  @Post()
  create(@Body() role: Partial<Roles>): Promise<Roles> {
    return this.rolesService.create(role);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator('Admin')
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() role: Partial<Roles>,
  ): Promise<Roles> {
    return this.rolesService.update(id, role);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator('Admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
}
