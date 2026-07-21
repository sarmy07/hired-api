import { NotificationType } from 'src/common/enums/notification.type.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  message: string;

  @Column({
    default: false,
  })
  isRead: boolean;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;
}
