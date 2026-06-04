import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsMongoId, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ example: '665f1a2b3c4d5e6f7a8b9c0d' })
  @IsMongoId()
  doctorId: string;

  @ApiProperty({ example: 4, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ example: 'Great doctor, very attentive.' })
  @IsString()
  @IsOptional()
  comment?: string;
}
