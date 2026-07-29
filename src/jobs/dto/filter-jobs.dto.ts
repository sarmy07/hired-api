import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { EmploymentType } from 'src/common/enums/employment-type.enum';
import { ExperienceLevel } from 'src/common/enums/experience-level.enum';

export class FilterJobDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(EmploymentType)
  employmentType?: EmploymentType;

  @IsOptional()
  @IsEnum(ExperienceLevel)
  experienceLevel?: ExperienceLevel;

  @IsOptional()
  @IsNumberString()
  minSalary?: string;

  @IsOptional()
  @IsNumberString()
  maxSalary?: string;

  @IsOptional()
  @IsString()
  skill?: string;
}
