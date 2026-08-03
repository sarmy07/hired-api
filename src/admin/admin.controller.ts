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
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/user.role.enum';

@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  findAllUsers() {
    return this.adminService.findAllUsers();
  }

  @Get('companies')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  findAllCompanies() {
    return this.adminService.findAllCompanies();
  }

  @Get('jobs')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  findAllJobs() {
    return this.adminService.findAllJobs();
  }

  @Get('/users/:id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

  @Get('/companies/:id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  findSingleCompany(@Param('id') id: string) {
    return this.adminService.findSingleCompany(id);
  }

  @Get('/jobs/:id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  findSingleJob(@Param('jobId') jobId: string) {
    return this.adminService.findSingleJob(jobId);
  }

  @Patch('/admin/users/:id/block-unblock')
  blockAndUnblockUser(@Param('userId') userId: string) {
    return this.adminService.blockAndUnblockUser(userId);
  }

  @Patch('/admin/jobs/:id/open-close')
  openAndCloseJobs(@Param('jobId') jobId: string) {
    return this.adminService.blockAndUnblockUser(jobId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete('/user/:id')
  remove(@Param('userId') userId: string) {
    return this.adminService.remove(userId);
  }

  @Delete('/companies/:id')
  deleteCompany(@Param('id') id: string) {
    return this.adminService.deleteCompany(id);
  }

  @Delete('/companies/:id')
  deleteJob(@Param('jobId') jobId: string) {
    return this.adminService.deleteJob(jobId);
  }
}
