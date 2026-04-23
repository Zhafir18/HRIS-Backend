import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { Department } from 'src/entity/department.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { RolesDecorator } from 'src/auth/roles.decorator';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto';

@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<Department[]> {
    return this.departmentService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Department> {
    return this.departmentService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator('Admin')
  @Post()
  create(@Body() data: CreateDepartmentDto): Promise<Department> {
    return this.departmentService.create(data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator('Admin')
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateDepartmentDto,
  ): Promise<Department> {
    return this.departmentService.update(id, data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator('Admin')
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.departmentService.remove(id);
  }
}
