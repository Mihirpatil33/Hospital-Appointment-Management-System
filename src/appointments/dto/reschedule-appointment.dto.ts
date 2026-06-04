import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class RescheduleAppointmentDto {
  @ApiProperty({ example: '2025-12-05T10:00:00.000Z' })
  @IsDateString()
  appointmentDate: string;
}
