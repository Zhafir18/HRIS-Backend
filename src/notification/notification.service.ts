import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entity/notification.entity';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async create(user_id: string, title: string, message: string): Promise<Notification> {
    const notification = this.notificationRepository.create({
      user_id,
      title,
      message,
      is_read: false,
    });
    const savedNotification = await this.notificationRepository.save(notification);
    
    // Push notification to user via WebSocket
    this.notificationGateway.sendToUser(user_id, savedNotification);
    
    return savedNotification;
  }

  async findMyNotifications(user_id: string): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { user_id },
      order: { created_at: 'DESC' },
      take: 50,
    });
  }

  async countUnread(user_id: string): Promise<number> {
    return this.notificationRepository.count({
      where: { user_id, is_read: false },
    });
  }

  async markAsRead(id: string, user_id: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id, user_id },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found or unauthorized');
    }

    notification.is_read = true;
    return this.notificationRepository.save(notification);
  }

  async markAllAsRead(user_id: string): Promise<void> {
    await this.notificationRepository.update(
      { user_id, is_read: false },
      { is_read: true },
    );
  }
}
