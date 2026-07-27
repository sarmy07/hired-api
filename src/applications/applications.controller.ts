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
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { CurrentUser } from 'src/common/decorators/current.user.decorator';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/user.role.enum';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post('apply')
  @Roles(Role.JOB_SEEKER)
  @ApiOperation({ summary: 'apply for a job - Job seekers only' })
  create(
    @Body() createApplicationDto: CreateApplicationDto,
    @CurrentUser() user: User,
  ) {
    return this.applicationsService.create(createApplicationDto, user.id);
  }

  @Get()
  @Roles(Role.EMPLOYER)
  @ApiOperation({
    summary: 'fetch all job applications for a singe company - employers only',
  })
  findAllApplicationsForSingleCompany(@Param('companyId') companyId: string) {
    return this.applicationsService.findAllApplicationsForSingleCompany(
      companyId,
    );
  }

  @Get(':id')
  @Roles(Role.JOB_SEEKER)
  @ApiOperation({ summary: 'fetch single application for a job-seeker' })
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.applicationsService.findOne(id, user.id);
  }

  @Patch(':id')
  @Roles(Role.EMPLOYER)
  @ApiOperation({ summary: 'update status of an application - employer only' })
  update(
    @Param('id') id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
    @CurrentUser() user: User,
  ) {
    return this.applicationsService.update(id, updateApplicationDto, user.id);
  }

  @Delete(':id')
  @Roles(Role.JOB_SEEKER)
  @ApiOperation({ summary: 'withdraw application - job seeker only' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.applicationsService.remove(id, user.id);
  }
}
