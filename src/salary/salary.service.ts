import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Salary, SalaryStatus } from '../entity/salary.entity';
import { CreateSalaryDto, UpdateSalaryStatusDto } from './dto/salary.dto';
import { PaginatedResult } from 'src/common/pagination.dto';

@Injectable()
export class SalaryService {
  constructor(
    @InjectRepository(Salary)
    private readonly salaryRepository: Repository<Salary>,
  ) {}

  async create(data: CreateSalaryDto): Promise<Salary> {
    const salary = this.salaryRepository.create(data);
    return this.salaryRepository.save(salary);
  }

  async findAll(page: number = 1, limit: number = 10, userId?: string): Promise<PaginatedResult<Salary>> {
    const skip = (page - 1) * limit;
    const qb = this.salaryRepository
      .createQueryBuilder('salary')
      .leftJoinAndSelect('salary.user', 'user')
      .orderBy('salary.year', 'DESC')
      .addOrderBy('salary.month', 'DESC');

    if (userId) {
      qb.where('salary.user_id = :userId', { userId });
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

  async findOne(id: string): Promise<Salary> {
    const salary = await this.salaryRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!salary) throw new NotFoundException('Salary record not found');
    return salary;
  }

  async updateStatus(id: string, data: UpdateSalaryStatusDto): Promise<Salary> {
    const salary = await this.findOne(id);
    salary.status = data.status;
    return this.salaryRepository.save(salary);
  }

  async remove(id: string): Promise<void> {
    const salary = await this.findOne(id);
    await this.salaryRepository.remove(salary);
  }
}
