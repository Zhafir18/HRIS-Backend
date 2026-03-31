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
import { AttendanceService } from './attendance.service';
import { Attendance } from 'src/entity/attendance.entity';
import { PaginatedResult } from 'src/common/pagination.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { RolesDecorator } from 'src/auth/roles.decorator';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Req() req,
    @Query()
    query: {
      username?: string;
      userId?: string;
      user_id?: string;
      status?: string;
      startDate?: string;
      endDate?: string;
      date?: string;
      page?: string;
      limit?: string;
    },
  ): Promise<PaginatedResult<Attendance>> {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '10', 10);

    if (
      query.username ||
      query.userId ||
      query.user_id ||
      query.status ||
      query.startDate ||
      query.endDate ||
      query.date
    ) {
      return this.attendanceService.findFiltered(
        query,
        req.user.userId,
        page,
        limit,
      );
    }

    return this.attendanceService.findAll(req.user.userId, page, limit);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator('Admin')
  @Get('all')
  findAllAttendance(
    @Query()
    query: {
      username?: string;
      userId?: string;
      user_id?: string;
      status?: string;
      startDate?: string;
      endDate?: string;
      date?: string;
      page?: string;
      limit?: string;
    },
  ): Promise<PaginatedResult<Attendance>> {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '10', 10);

    if (
      query.username ||
      query.userId ||
      query.user_id ||
      query.status ||
      query.startDate ||
      query.endDate ||
      query.date
    ) {
      return this.attendanceService.findFiltered(query, undefined, page, limit);
    }

    return this.attendanceService.findAll(undefined, page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Attendance> {
    return this.attendanceService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('check-in')
  checkIn(@Req() req, @Body() body) {
    return this.attendanceService.checkIn(req.user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('check-out')
  checkOut(@Req() req) {
    return this.attendanceService.checkOut(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendanceService.remove(id);
  }
}
