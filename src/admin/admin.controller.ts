import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/user.role.enum';

@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, RoleGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @Roles(Role.ADMIN)
  findAllUsers() {
    return this.adminService.findAllUsers();
  }

  @Get('companies')
  @Roles(Role.ADMIN)
  findAllCompanies() {
    return this.adminService.findAllCompanies();
  }

  @Get('jobs')
  @Roles(Role.ADMIN)
  findAllJobs() {
    return this.adminService.findAllJobs();
  }

  @Get('/users/:id')
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

  @Get('/companies/:id')
  @Roles(Role.ADMIN)
  findSingleCompany(@Param('id') id: string) {
    return this.adminService.findSingleCompany(id);
  }

  @Get('/jobs/:id')
  @Roles(Role.ADMIN)
  findSingleJob(@Param('jobId') jobId: string) {
    return this.adminService.findSingleJob(jobId);
  }

  @Patch('/users/:id/block-unblock')
  @Roles(Role.ADMIN)
  blockAndUnblockUser(@Param('userId') userId: string) {
    return this.adminService.blockAndUnblockUser(userId);
  }

  @Delete('/user/:id')
  @Roles(Role.ADMIN)
  remove(@Param('userId') userId: string) {
    return this.adminService.remove(userId);
  }

  @Delete('/companies/:id')
  @Roles(Role.ADMIN)
  deleteCompany(@Param('id') id: string) {
    return this.adminService.deleteCompany(id);
  }

  @Delete('/companies/:id')
  @Roles(Role.ADMIN)
  deleteJob(@Param('jobId') jobId: string) {
    return this.adminService.deleteJob(jobId);
  }
}
