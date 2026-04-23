import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from 'src/entity/department.entity';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  async findAll(): Promise<Department[]> {
    return this.departmentRepository.find();
  }

  async findOne(id: string): Promise<Department> {
    const department = await this.departmentRepository.findOne({ where: { id } });
    if (!department) {
      throw new NotFoundException(`Department with id ${id} not found`);
    }
    return department;
  }

  async create(data: Partial<Department>): Promise<Department> {
    const department = this.departmentRepository.create(data);
    return this.departmentRepository.save(department);
  }

  async update(id: string, data: Partial<Department>): Promise<Department> {
    const department = await this.findOne(id);
    Object.assign(department, data);
    department.updated_at = new Date();
    return this.departmentRepository.save(department);
  }

  async remove(id: string): Promise<void> {
    const department = await this.findOne(id);
    await this.departmentRepository.remove(department);
  }
}
