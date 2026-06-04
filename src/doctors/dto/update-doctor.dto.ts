import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateDoctorDto {
  @ApiPropertyOptional({ example: 'Cardiology' })
  @IsString()
  @IsOptional()
  specialization?: string;

  @ApiPropertyOptional({ example: 5 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  experience?: number;

  @ApiPropertyOptional({ example: 'MBBS, MD' })
  @IsString()
  @IsOptional()
  qualification?: string;

  @ApiPropertyOptional({ example: 500 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  consultationFee?: number;

  @ApiPropertyOptional({ example: 'Experienced cardiologist...' })
  @IsString()
  @IsOptional()
  about?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}
