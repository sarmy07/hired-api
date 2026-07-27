import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateApplicationDto {
  @ApiProperty()
  @IsUUID()
  jobId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  coverLetter?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  resumeSnapshot?: string;
}
