import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Backend Development' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Jobs focused on server-side development and APIs',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
