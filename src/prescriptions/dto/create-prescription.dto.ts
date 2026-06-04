import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePrescriptionDto {
  @ApiProperty({ example: '665f1a2b3c4d5e6f7a8b9c0d' })
  @IsMongoId()
  appointmentId: string;

  @ApiProperty({ example: 'Viral Fever' })
  @IsString()
  @IsNotEmpty()
  diagnosis: string;

  @ApiProperty({ example: 'Paracetamol 500mg twice daily for 5 days' })
  @IsString()
  @IsNotEmpty()
  prescription: string;

  @ApiPropertyOptional({ example: 'Rest, drink fluids, follow up in 1 week' })
  @IsString()
  @IsOptional()
  treatmentPlan?: string;
}
