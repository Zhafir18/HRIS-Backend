import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entity/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { PaginatedResult } from 'src/common/pagination.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  findAll(page: number = 1, limit: number = 10): Promise<PaginatedResult<Users>> {
    return this.findFiltered({}, page, limit);
  }

  async findOne(id: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['role'],
      select: {
        id: true,
        username: true,
        email: true,
        role: {
          id: true,
          name: true,
        },
      },
    });

    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    return user;
  }

  async create(user: Partial<Users>): Promise<Users> {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }

  async update(id: string, user: Partial<Users>): Promise<Users> {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
    await this.usersRepository.update(id, user);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`User with id ${id} not found`);
  }

  async findFiltered(
    query: {
      username?: string;
      email?: string;
      roleId?: string;
      search?: string;
    },
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResult<Users>> {
    const skip = (page - 1) * limit;

    const qb = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role');

    if (query.username)
      qb.andWhere('user.username LIKE :username', {
        username: `%${query.username}%`,
      });
    if (query.email)
      qb.andWhere('user.email LIKE :email', { email: `%${query.email}%` });
    if (query.roleId) qb.andWhere('role.id = :roleId', { roleId: query.roleId });
    if (query.search) {
      qb.andWhere(
        '(user.username LIKE :search OR user.email LIKE :search)',
        { search: `%${query.search}%` },
      );
    }

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
