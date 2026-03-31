import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Users } from './users.entity';

export enum AttendanceStatus {
  TELAT = 'Late',
  TIDAK_TELAT = 'Normal',
}

@Entity('attendance')
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uniqueidentifier')
  user_id: string;

  @Column('datetime', { nullable: false })
  log_in_time: Date;

  @Column('datetime', { nullable: true })
  log_out_time: Date;

  @Column('nvarchar', { nullable: false })
  status: AttendanceStatus;

  @Column({ type: 'nvarchar', length: 100, nullable: false })
  location: string;

  @Column({ type: 'varbinary', length: 'max', nullable: false, select: false })
  face_recognition: Buffer;
  
  @Exclude()
  @Column('datetime', { nullable: false, default: () => 'GETDATE()' })
  created_at: Date;

  @Exclude()
  @Column('datetime', { nullable: true, default: () => 'GETDATE()' })
  updated_at: Date;

  @Exclude()
  @Column('datetime', { nullable: true, default: () => 'GETDATE()' })
  deleted_at: Date;

  @ManyToOne(() => Users, (user) => user.attendance)
  @JoinColumn({ name: 'user_id' })
  user: Users;
}
