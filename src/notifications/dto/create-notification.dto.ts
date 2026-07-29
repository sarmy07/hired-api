import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { NotificationType } from 'src/common/enums/notification.type.enum';

export class CreateNotificationDto {
  @ApiProperty()
  @IsString()
  recipientId: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  message: string;

  @ApiProperty()
  @IsEnum(NotificationType)
  type: NotificationType;
}
