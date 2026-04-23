import { IsEnum, IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';
import { LeaveType, LeaveStatus } from 'src/entity/leave-request.entity';

export class CreateLeaveRequestDto {
  @IsDateString()
  @IsNotEmpty()
  start_date: string;

  @IsDateString()
  @IsNotEmpty()
  end_date: string;

  @IsEnum(LeaveType)
  @IsNotEmpty()
  type: LeaveType;

  @IsString()
  @IsNotEmpty()
  reason: string;
}

export class UpdateLeaveStatusDto {
  @IsEnum(LeaveStatus)
  @IsNotEmpty()
  status: LeaveStatus;

  @IsString()
  @IsOptional()
  admin_notes?: string;
}
