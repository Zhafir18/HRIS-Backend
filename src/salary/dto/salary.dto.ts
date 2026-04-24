import { IsNumber, IsEnum, IsUUID, IsOptional, Max, Min } from 'class-validator';
import { SalaryStatus } from '../../entity/salary.entity';

export class CreateSalaryDto {
  @IsUUID()
  user_id: string;

  @IsNumber()
  amount: number;

  @IsNumber()
  @Min(1)
  @Max(12)
  month: number;

  @IsNumber()
  year: number;

  @IsOptional()
  @IsEnum(SalaryStatus)
  status?: SalaryStatus;
}

export class UpdateSalaryStatusDto {
  @IsEnum(SalaryStatus)
  status: SalaryStatus;
}
