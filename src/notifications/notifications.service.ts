import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { NotificationType } from 'src/common/enums/notification.type.enum';
import { CompaniesService } from 'src/companies/companies.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    private readonly userService: UsersService,
    private readonly companyService: CompaniesService,
  ) {}

  async create(dto: CreateNotificationDto) {
    const user = await this.userService.findOne(dto.recipientId);
    if (!user) throw new NotFoundException('recipient not found');

    const notification = this.notificationRepo.create({
      recipient: user,
      title: dto.title,
      message: dto.message,
      type: dto.type,
    });

    return await this.notificationRepo.save(notification);
  }

  async findAll(userId: string) {
    return await this.notificationRepo.find({
      where: {
        recipient: {
          id: userId,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string, userId: string) {
    return await this.notificationRepo.findOne({
      where: {
        id,
        recipient: { id: userId },
      },
    });
  }

  async markAsRead(id: string, userId: string) {
    const notification = await this.findOne(id, userId);
    if (!notification) return null;

    notification.isRead = true;

    return await this.notificationRepo.save(notification);
  }

  async markAllAsRead(userId: string) {
    await this.notificationRepo.update(
      {
        recipient: {
          id: userId,
        },
        isRead: false,
      },
      { isRead: true },
    );
    return {
      message: 'All notifications marked as read',
      success: true,
    };
  }

  async unreadCount(userId: string): Promise<Number> {
    return await this.notificationRepo.count({
      where: {
        recipient: {
          id: userId,
        },
        isRead: false,
      },
    });
  }

  async update(id: string, dto: UpdateNotificationDto) {}

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
