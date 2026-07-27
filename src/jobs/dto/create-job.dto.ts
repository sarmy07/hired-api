import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { EmploymentType } from 'src/common/enums/employment-type.enum';
import { ExperienceLevel } from 'src/common/enums/experience-level.enum';

export class CreateJobDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsUUID()
  companyId: string;

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  skillids: string[];

  @ApiProperty()
  @IsEnum(EmploymentType)
  employmentType: EmploymentType;

  @ApiProperty()
  @IsEnum(ExperienceLevel)
  experienceLevel: ExperienceLevel;

  @ApiProperty()
  @IsOptional()
  salaryMin?: number;

  @ApiProperty()
  @IsOptional()
  salaryMax?: number;

  @ApiProperty()
  @IsOptional()
  location?: string;
}
