/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { CurrentUser } from 'src/common/decorators/current.user.decorator';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/user.role.enum';
import { RoleGuard } from 'src/auth/guards/role.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('employer')
  @UseGuards(RoleGuard)
  @Roles(Role.EMPLOYER)
  getEmployerDashboard(@CurrentUser() user: User) {
    return this.dashboardService.getEmployerDashboard(user.id);
  }
}
