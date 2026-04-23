import { IsString, IsNumber, IsOptional, MaxLength, Min, Max } from 'class-validator';

export class CreateOfficeDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  radius?: number;
}

export class UpdateOfficeDto {
  @IsString()
  @MaxLength(100)
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @IsNumber()
  @IsOptional()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  radius?: number;
}
