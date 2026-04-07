import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance, AttendanceStatus } from 'src/entity/attendance.entity';
import { PaginatedResult } from 'src/common/pagination.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
  ) {}

  findAll(
    userId?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResult<Attendance>> {
    return this.findFiltered({}, userId, page, limit);
  }

  async findOne(id: string): Promise<Attendance> {
    const attendance = await this.attendanceRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!attendance) {
      throw new NotFoundException(`Attendance with id ${id} not found`);
    }

    if (attendance && attendance.face_recognition) {
      attendance.face_recognition = `/assets/face_recognition/${attendance.face_recognition}`;
    }
    return attendance;
  }

  async checkIn(user_id: string, data: Partial<Attendance>): Promise<Attendance> {
    const now = new Date();

    const existing = await this.attendanceRepository
      .createQueryBuilder('attendance')
      .where('attendance.user_id = :user_id', { user_id })
      .andWhere(
        'CAST(attendance.log_in_time AS DATE) = CAST(GETDATE() AS DATE)',
      )
      .getOne();

    if (existing) {
      throw new BadRequestException('User sudah check-in hari ini');
    }

    const batasJamMasuk = 8;
    const jamMasuk = now.getHours();

    const status =
      jamMasuk >= batasJamMasuk
        ? AttendanceStatus.TELAT
        : AttendanceStatus.TIDAK_TELAT;

    if (data.face_recognition && typeof data.face_recognition === 'string') {
      const base64Data = (data.face_recognition as any as string).replace(
        /^data:image\/\w+;base64,/,
        '',
      );
      
      const fileName = `attendance_${user_id}_${Date.now()}.png`;
      const uploadDir = path.join(process.cwd(), 'assets', 'face_recognition');
      
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, base64Data, 'base64');
      
      data.face_recognition = fileName;
    }

    const newData = this.attendanceRepository.create({
      ...data,
      user_id,
      log_in_time: now,
      status,
      created_at: now,
      updated_at: now,
    });

    const saved = await this.attendanceRepository.save(newData);
    if (saved.face_recognition) {
      saved.face_recognition = `/assets/face_recognition/${saved.face_recognition}`;
    }
    return saved;
  }

  async checkOut(user_id: string): Promise<Attendance> {
    const now = new Date();

    const attendance = await this.attendanceRepository
      .createQueryBuilder('attendance')
      .where('attendance.user_id = :user_id', { user_id })
      .andWhere(
        'CAST(attendance.log_in_time AS DATE) = CAST(GETDATE() AS DATE)',
      )
      .getOne();

    if (!attendance) {
      throw new NotFoundException('User belum check-in hari ini');
    }

    if (attendance.log_out_time) {
      throw new BadRequestException('User sudah check-out');
    }

    attendance.log_out_time = now;
    attendance.updated_at = now;

    const saved = await this.attendanceRepository.save(attendance);
    return saved;
  }

  async findFiltered(
    query: {
      username?: string;
      userId?: string;
      user_id?: string;
      status?: string;
      startDate?: string;
      endDate?: string;
      date?: string;
    },
    userId?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResult<Attendance>> {
    const skip = (page - 1) * limit;

    const qb = this.attendanceRepository
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.user', 'user');

    if (userId) {
      qb.andWhere('attendance.user_id = :userId', { userId });
    }

    if (query.username) {
      qb.andWhere('user.username LIKE :username', {
        username: `%${query.username}%`,
      });
    }

    const filterUserId = query.userId || query.user_id;
    if (filterUserId) {
      qb.andWhere('attendance.user_id = :filterUserId', {
        filterUserId,
      });
    }

    if (query.status) {
      qb.andWhere('attendance.status = :status', {
        status: query.status,
      });
    }

    if (query.startDate && query.endDate) {
      qb.andWhere('attendance.log_in_time BETWEEN :startDate AND :endDate', {
        startDate: query.startDate,
        endDate: query.endDate,
      });
    } else {
      const filterDate = query.startDate || query.date;
      if (filterDate) {
        qb.andWhere('CAST(attendance.log_in_time AS DATE) = :filterDate', {
          filterDate,
        });
      }
    }

    const [data, total] = await qb
      .orderBy('attendance.log_in_time', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const formattedData = data.map((item) => {
      if (item.face_recognition) {
        item.face_recognition = `/assets/face_recognition/${item.face_recognition}`;
      }
      return item;
    });

    return {
      data: formattedData,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
