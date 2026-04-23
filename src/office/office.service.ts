import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Office } from 'src/entity/office.entity';

@Injectable()
export class OfficeService {
  constructor(
    @InjectRepository(Office)
    private readonly officeRepository: Repository<Office>,
  ) {}

  async findAll(): Promise<Office[]> {
    return this.officeRepository.find();
  }

  async findOne(id: string): Promise<Office> {
    const office = await this.officeRepository.findOne({ where: { id } });
    if (!office) {
      throw new NotFoundException(`Office with id ${id} not found`);
    }
    return office;
  }

  async create(data: Partial<Office>): Promise<Office> {
    const office = this.officeRepository.create(data);
    return this.officeRepository.save(office);
  }

  async update(id: string, data: Partial<Office>): Promise<Office> {
    const office = await this.findOne(id);
    Object.assign(office, data);
    office.updated_at = new Date();
    return this.officeRepository.save(office);
  }

  async remove(id: string): Promise<void> {
    const office = await this.findOne(id);
    await this.officeRepository.remove(office);
  }
}
