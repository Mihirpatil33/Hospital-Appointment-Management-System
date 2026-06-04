import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RescheduleAppointmentDto {
  @ApiProperty({ example: '2025-12-15T14:00:00.000Z', description: 'New appointment date (must be future)' })
  @IsDateString()
  @IsNotEmpty()
  appointmentDate: string;

  @ApiPropertyOptional({ example: 'Patient requested earlier slot' })
  @IsOptional()
  @IsString()
  notes?: string;
}
