import { IsString, IsNumber, IsOptional, MaxLength, Min, Max } from 'class-validator';

export class CheckInDto {
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @IsString()
  @MaxLength(100)
  location: string;

  @IsString()
  face_recognition: string;
}
