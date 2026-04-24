import { Controller, Get, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notification')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getMyNotifications(@Request() req) {
    const user_id = req.user.id;
    const notifications = await this.notificationService.findMyNotifications(user_id);
    const unreadCount = await this.notificationService.countUnread(user_id);
    
    return {
      statusCode: 200,
      message: 'Notifications retrieved successfully',
      data: {
        notifications,
        unreadCount,
      },
    };
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Request() req) {
    const user_id = req.user.id;
    const notification = await this.notificationService.markAsRead(id, user_id);
    
    return {
      statusCode: 200,
      message: 'Notification marked as read',
      data: notification,
    };
  }

  @Patch('read-all')
  async markAllAsRead(@Request() req) {
    const user_id = req.user.id;
    await this.notificationService.markAllAsRead(user_id);
    
    return {
      statusCode: 200,
      message: 'All notifications marked as read',
    };
  }
}
