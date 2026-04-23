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
import { LeaveService } from './leave.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { RolesDecorator } from 'src/auth/roles.decorator';
import { CreateLeaveRequestDto, UpdateLeaveStatusDto } from './dto/leave.dto';
import { LeaveStatus } from 'src/entity/leave-request.entity';

@Controller('leave-requests')
@UseGuards(JwtAuthGuard)
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Post()
  create(@Req() req, @Body() data: CreateLeaveRequestDto) {
    return this.leaveService.create(req.user.userId, data);
  }

  @Get('my')
  findMyLeaves(
    @Req() req,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    return this.leaveService.findMyLeaves(
      req.user.userId,
      parseInt(page || '1'),
      parseInt(limit || '10'),
    );
  }

  @Get('admin')
  @UseGuards(RolesGuard)
  @RolesDecorator('Admin')
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('status') status: LeaveStatus,
  ) {
    return this.leaveService.findAll(
      parseInt(page || '1'),
      parseInt(limit || '10'),
      status,
    );
  }

  @Put(':id/status')
  @UseGuards(RolesGuard)
  @RolesDecorator('Admin')
  updateStatus(@Param('id') id: string, @Body() data: UpdateLeaveStatusDto) {
    return this.leaveService.updateStatus(id, data);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.leaveService.remove(id, req.user.userId);
  }
}
