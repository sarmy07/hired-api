import { Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsInt,
  IsNumberString,
  IsOptional,
  IsPositive,
  IsString,
  min,
  Min,
} from 'class-validator';
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

  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsIn(['createdAt', 'minSalary', 'maxSalary', 'title'])
  sortBy?: 'createdAt' | 'minSalary' | 'maxSalary' | 'title';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC' = 'DESC';
}
