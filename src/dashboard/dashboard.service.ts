import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entity/users.entity';
import { Attendance, AttendanceStatus } from '../entity/attendance.entity';
import { LeaveRequest, LeaveStatus } from '../entity/leave-request.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    @InjectRepository(LeaveRequest)
    private readonly leaveRequestRepository: Repository<LeaveRequest>,
  ) {}

  async getDashboardStats() {
    const totalEmployees = await this.usersRepository.count();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const presentToday = await this.attendanceRepository
      .createQueryBuilder('attendance')
      .where('attendance.log_in_time BETWEEN :start AND :end', {
        start: todayStart,
        end: todayEnd,
      })
      .getCount();

    const lateArrival = await this.attendanceRepository
      .createQueryBuilder('attendance')
      .where('attendance.log_in_time BETWEEN :start AND :end', {
        start: todayStart,
        end: todayEnd,
      })
      .andWhere('attendance.status = :status', { status: AttendanceStatus.TELAT })
      .getCount();

    let onLeave = 0;
    try {
      onLeave = await this.leaveRequestRepository
        .createQueryBuilder('leave')
        .where('leave.status = :status', { status: LeaveStatus.APPROVED })
        .andWhere('CAST(leave.start_date AS DATE) <= CURRENT_DATE')
        .andWhere('CAST(leave.end_date AS DATE) >= CURRENT_DATE')
        .getCount();
    } catch (error) {
      console.warn('Could not query leave requests (table might not exist):', error.message);
    }

    return {
      totalEmployees,
      presentToday,
      lateArrival,
      onLeave,
    };
  }
}
