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

@Entity({ name: 'Users' })
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'nvarchar', length: 255 })
  username: string;

  @Column({ type: 'nvarchar', length: 255 })
  email: string;

  @Exclude()
  @Column({ type: 'nvarchar', length: 255, select: false })
  password: string;

  @Column('uniqueidentifier')
  role_id: string;

  @Exclude()
  @Column('datetime')
  created_at: Date;

  @Exclude()
  @Column('datetime')
  updated_at: Date;

  @Exclude()
  @Column('datetime')
  deleted_at: Date;

  @ManyToOne(() => Roles, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role: Roles;

  @OneToMany(() => Attendance, (attendance) => attendance.user)
  attendance: Attendance[];
}
