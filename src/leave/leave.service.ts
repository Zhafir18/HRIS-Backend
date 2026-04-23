import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveRequest, LeaveStatus } from 'src/entity/leave-request.entity';
import { CreateLeaveRequestDto, UpdateLeaveStatusDto } from './dto/leave.dto';
import { PaginatedResult } from 'src/common/pagination.dto';

@Injectable()
export class LeaveService {
  constructor(
    @InjectRepository(LeaveRequest)
    private readonly leaveRepository: Repository<LeaveRequest>,
  ) {}

  async create(user_id: string, data: CreateLeaveRequestDto): Promise<LeaveRequest> {
    const leave = this.leaveRepository.create({
      ...data,
      user_id,
      status: LeaveStatus.PENDING,
    });
    return this.leaveRepository.save(leave);
  }

  async findMyLeaves(user_id: string, page: number = 1, limit: number = 10): Promise<PaginatedResult<LeaveRequest>> {
    const skip = (page - 1) * limit;
    const [data, total] = await this.leaveRepository.findAndCount({
      where: { user_id },
      order: { created_at: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAll(page: number = 1, limit: number = 10, status?: LeaveStatus): Promise<PaginatedResult<LeaveRequest>> {
    const skip = (page - 1) * limit;
    const qb = this.leaveRepository
      .createQueryBuilder('leave')
      .leftJoinAndSelect('leave.user', 'user')
      .orderBy('leave.created_at', 'DESC');

    if (status) {
      qb.where('leave.status = :status', { status });
    }

    const [data, total] = await qb.skip(skip).take(limit).getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateStatus(id: string, data: UpdateLeaveStatusDto): Promise<LeaveRequest> {
    const leave = await this.leaveRepository.findOne({ where: { id } });
    if (!leave) {
      throw new NotFoundException('Leave request not found');
    }

    leave.status = data.status;
    if (data.admin_notes) {
      leave.admin_notes = data.admin_notes;
    }

    return this.leaveRepository.save(leave);
  }

  async remove(id: string, user_id: string): Promise<void> {
    const leave = await this.leaveRepository.findOne({ where: { id, user_id } });
    if (!leave) {
      throw new NotFoundException('Leave request not found or unauthorized');
    }
    if (leave.status !== LeaveStatus.PENDING) {
      throw new Error('Only pending leave requests can be deleted');
    }
    await this.leaveRepository.remove(leave);
  }
}
