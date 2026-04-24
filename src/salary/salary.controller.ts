import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { SalaryService } from './salary.service';
import { CreateSalaryDto, UpdateSalaryStatusDto } from './dto/salary.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { RolesDecorator } from '../auth/roles.decorator';

@Controller('salary')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SalaryController {
  constructor(private readonly salaryService: SalaryService) {}

  @Post()
  @RolesDecorator('Admin')
  create(@Body() createSalaryDto: CreateSalaryDto) {
    return this.salaryService.create(createSalaryDto);
  }

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('userId') userId?: string,
    @Request() req?,
  ) {
    // If not Admin, only allow viewing own salary
    if (req.user.role.name !== 'Admin') {
      return this.salaryService.findAll(page, limit, req.user.id);
    }
    return this.salaryService.findAll(page, limit, userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salaryService.findOne(id);
  }

  @Patch(':id/status')
  @RolesDecorator('Admin')
  updateStatus(
    @Param('id') id: string,
    @Body() updateSalaryStatusDto: UpdateSalaryStatusDto,
  ) {
    return this.salaryService.updateStatus(id, updateSalaryStatusDto);
  }

  @Delete(':id')
  @RolesDecorator('Admin')
  remove(@Param('id') id: string) {
    return this.salaryService.remove(id);
  }
}
