import { PartialType } from '@nestjs/swagger';
import { CreateProfileDto } from './create-profile.dto';
import { IsOptional } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  firstName: string;

  @IsOptional()
  lastName: string;

  @IsOptional()
  phoneNumber: string;

  @IsOptional()
  location: string;

  @IsOptional()
  bio: string;

  @IsOptional()
  portofolioUrl: string;

  @IsOptional()
  githubUrl: string;

  @IsOptional()
  linkedinUrl: string;
}
