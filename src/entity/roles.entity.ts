import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Users } from './users.entity';

@Entity({ name: 'Roles' })
export class Roles {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'nvarchar', length: 50 })
  name: string;

  @Exclude()
  @Column('datetime')
  created_at: Date;

  @Exclude()
  @Column('datetime')
  updated_at: Date;

  @Exclude()
  @Column('datetime')
  deleted_at: Date;

  @OneToMany(() => Users, (user) => user.role)
  users: Users[];
}
