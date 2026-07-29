import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateSavedJobDto {
  @ApiProperty()
  @IsUUID()
  jobId: string;
}
