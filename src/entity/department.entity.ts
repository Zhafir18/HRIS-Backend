import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Users } from './users.entity';

@Entity('department')
export class Department {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Exclude()
  @Column({ type: 'timestamp', nullable: false, default: () => 'now()' })
  created_at: Date;

  @Exclude()
  @Column({ type: 'timestamp', nullable: true, default: () => 'now()' })
  updated_at: Date;

  @Exclude()
  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  @OneToMany(() => Users, (user) => user.department)
  users: Users[];
}
