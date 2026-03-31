import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from 'src/entity/attendance.entity';
import { Users } from 'src/entity/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attendance])
  ],
  providers: [AttendanceService],
  controllers: [AttendanceController]
})
export class AttendanceModule {}
