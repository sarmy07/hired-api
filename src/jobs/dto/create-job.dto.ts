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
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsUUID()
  companyId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  skillids: string[];

  @IsEnum(EmploymentType)
  employmentType: EmploymentType;

  @IsEnum(ExperienceLevel)
  experienceLevel: ExperienceLevel;

  @IsOptional()
  salaryMin?: number;

  @IsOptional()
  salaryMax?: number;

  @IsOptional()
  location?: string;
}
