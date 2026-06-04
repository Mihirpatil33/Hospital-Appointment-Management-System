import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({ example: '665f1a2b3c4d5e6f7a8b9c0d' })
  @IsMongoId()
  doctorId: string;

  @ApiProperty({ example: '2025-12-01T10:00:00.000Z' })
  @IsDateString()
  appointmentDate: string;

  @ApiProperty({ example: 'Fever and cold for 3 days' })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiPropertyOptional({ example: 'Patient has no allergies' })
  @IsString()
  @IsOptional()
  notes?: string;
}
