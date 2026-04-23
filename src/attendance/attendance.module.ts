import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from 'src/entity/attendance.entity';
import { Office } from 'src/entity/office.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attendance, Office])
  ],
  providers: [AttendanceService],
  controllers: [AttendanceController]
})
export class AttendanceModule {}
