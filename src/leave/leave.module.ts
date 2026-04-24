import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveService } from './leave.service';
import { LeaveController } from './leave.controller';
import { LeaveRequest } from 'src/entity/leave-request.entity';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LeaveRequest]),
    NotificationModule
  ],
  controllers: [LeaveController],
  providers: [LeaveService],
})
export class LeaveModule {}
