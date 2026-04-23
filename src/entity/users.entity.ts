import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Roles } from './roles.entity';
import { Attendance } from './attendance.entity';
import { Department } from './department.entity';

@Entity({ name: 'Users' })
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 255, select: false })
  password: string;

  @Column({ type: 'uuid', nullable: true })
  role_id: string;

  @Column({ type: 'uuid', nullable: true })
  department_id: string;

  @Exclude()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Exclude()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Exclude()
  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  @ManyToOne(() => Roles, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role: Roles;

  @ManyToOne(() => Department, (department) => department.users)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @OneToMany(() => Attendance, (attendance) => attendance.user)
  attendance: Attendance[];
}
