import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('office')
export class Office {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: false })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: false })
  longitude: number;

  @Column({ type: 'int', default: 100 }) // Radius in meters
  radius: number;

  @Exclude()
  @Column({ type: 'timestamp', nullable: false, default: () => 'now()' })
  created_at: Date;

  @Exclude()
  @Column({ type: 'timestamp', nullable: true, default: () => 'now()' })
  updated_at: Date;

  @Exclude()
  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;
}
