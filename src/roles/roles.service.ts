import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from 'src/entity/roles.entity';
import { Repository } from 'typeorm';
import { PaginatedResult } from 'src/common/pagination.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
  ) {}

  findAll(page: number = 1, limit: number = 10): Promise<PaginatedResult<Roles>> {
    return this.findFiltered({}, page, limit);
  }

  findRoles(): Promise<Roles[]> {
    return this.rolesRepository.find()
  }

  async findOne(id: string): Promise<Roles> {
    const role = await this.rolesRepository.findOne({
      where: { id },
      relations: ['users'],
    });
    if (!role) throw new NotFoundException(`Role with id ${id} not found`);
    return role;
  }

  create(role: Partial<Roles>): Promise<Roles> {
    const newRole = this.rolesRepository.create(role);
    return this.rolesRepository.save(newRole);
  }

  async update(id: string, role: Partial<Roles>): Promise<Roles> {
    await this.rolesRepository.update(id, role);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.rolesRepository.update(id, {deleted_at: new Date()});
    if (result.affected === 0)
      throw new NotFoundException(`Role with id ${id} not found`);
  }

  async findFiltered(
    query: { name?: string },
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResult<Roles>> {
    const skip = (page - 1) * limit;

    const qb = this.rolesRepository.createQueryBuilder('role');

    if (query.name)
      qb.where('role.name LIKE :name', { name: `%${query.name}%` });

    const [data, total] = await qb
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
