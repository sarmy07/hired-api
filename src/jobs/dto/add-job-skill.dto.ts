import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';

export class AddJobSkillDto {
  @ApiProperty({
    example: ['f5e98ab9-05f3-4925-b016-27c4d5632277'],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  skillIds: string[];
}
