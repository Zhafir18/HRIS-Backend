import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @MaxLength(50)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateRoleDto {
  @IsString()
  @MaxLength(50)
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
