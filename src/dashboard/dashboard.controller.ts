import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { RolesDecorator } from '../auth/roles.decorator';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @RolesDecorator('Admin')
  async getDashboardStats() {
    const data = await this.dashboardService.getDashboardStats();
    return {
      statusCode: 200,
      message: 'Dashboard statistics retrieved successfully',
      data,
    };
  }
}
