import { IsString, IsEmail, IsOptional, IsUUID, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsUUID()
  @IsOptional()
  role_id?: string;

  @IsUUID()
  @IsOptional()
  department_id?: string;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @IsUUID()
  @IsOptional()
  role_id?: string;

  @IsUUID()
  @IsOptional()
  department_id?: string;
}
