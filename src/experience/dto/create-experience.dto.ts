import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateExperienceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  company: string;

  @ApiProperty()
  @IsString()
  position: string;

  @ApiProperty()
  @IsDateString()
  startDate: string;

  @ApiProperty()
  currentlyWorking: boolean;

  @IsOptional()
  @IsDateString()
  endDate?: string | null;

  @IsOptional()
  description?: string;
}
