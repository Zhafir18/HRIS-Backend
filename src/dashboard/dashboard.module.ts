import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Users } from '../entity/users.entity';
import { Attendance } from '../entity/attendance.entity';
import { LeaveRequest } from '../entity/leave-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Attendance, LeaveRequest])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
