import { IsOptional } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  firstName?: string;

  @IsOptional()
  lastName?: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  location?: string;

  @IsOptional()
  bio?: string;

  @IsOptional()
  portofolio?: string;

  @IsOptional()
  github?: string;

  @IsOptional()
  linkedIn?: string;

  @IsOptional()
  address?: string;

  @IsOptional()
  avatar?: string | null;
}
