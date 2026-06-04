import { IsString, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({ example: '665f1b2c3d4e5f6a7b8c9d0e', description: 'Doctor profile ID' })
  @IsString()
  @IsNotEmpty()
  doctorId: string;

  @ApiProperty({ example: '2025-12-01T10:00:00.000Z', description: 'Must be a future date' })
  @IsDateString()
  @IsNotEmpty()
  appointmentDate: string;

  @ApiProperty({ example: 'Chest pain and shortness of breath' })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiPropertyOptional({ example: 'Patient has history of hypertension' })
  @IsOptional()
  @IsString()
  notes?: string;
}
