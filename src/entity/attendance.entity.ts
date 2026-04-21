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

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'timestamp', nullable: false })
  log_in_time: Date;

  @Column({ type: 'timestamp', nullable: true })
  log_out_time: Date;

  @Column({ type: 'varchar', nullable: false })
  status: AttendanceStatus;

  @Column({ type: 'varchar', length: 100, nullable: false })
  location: string;

  @Column({ type: 'text', nullable: false })
  face_recognition: string;
  
  @Exclude()
  @Column({ type: 'timestamp', nullable: false, default: () => 'now()' })
  created_at: Date;

  @Exclude()
  @Column({ type: 'timestamp', nullable: true, default: () => 'now()' })
  updated_at: Date;

  @Exclude()
  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  @ManyToOne(() => Users, (user) => user.attendance)
  @JoinColumn({ name: 'user_id' })
  user: Users;
}
