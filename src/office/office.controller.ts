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
import { OfficeService } from './office.service';
import { Office } from 'src/entity/office.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { RolesDecorator } from 'src/auth/roles.decorator';
import { CreateOfficeDto, UpdateOfficeDto } from './dto/office.dto';

@Controller('offices')
export class OfficeController {
  constructor(private readonly officeService: OfficeService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<Office[]> {
    return this.officeService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Office> {
    return this.officeService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator('Admin')
  @Post()
  create(@Body() data: CreateOfficeDto): Promise<Office> {
    return this.officeService.create(data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator('Admin')
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateOfficeDto,
  ): Promise<Office> {
    return this.officeService.update(id, data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator('Admin')
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.officeService.remove(id);
  }
}
