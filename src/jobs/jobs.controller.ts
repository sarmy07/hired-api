import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { CurrentUser } from 'src/common/decorators/current.user.decorator';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/user.role.enum';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FilterJobDto } from './dto/filter-jobs.dto';
import { AddJobSkillDto } from './dto/add-job-skill.dto';

@ApiBearerAuth()
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.EMPLOYER)
  create(@Body() createJobDto: CreateJobDto, @CurrentUser() user: User) {
    return this.jobsService.create(createJobDto, user.id);
  }

  @Get()
  findAll(@Query() query: FilterJobDto) {
    return this.jobsService.findAll(query);
  }

  @Post(':id/skills')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.EMPLOYER)
  @ApiOperation({ summary: 'add skill' })
  addSkills(
    @Param('id') id: string,
    @Body() dto: AddJobSkillDto,
    @CurrentUser() user: User,
  ) {
    return this.jobsService.addSkills(id, user.id, dto);
  }

  @Delete(':id/skills/:skillId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.EMPLOYER)
  @ApiOperation({ summary: 'remove skill' })
  removeSkill(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Param('skillId') skillId: string,
  ) {
    return this.jobsService.removeSkill(user.id, id, skillId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.EMPLOYER)
  update(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
    @CurrentUser() user: User,
  ) {
    return this.jobsService.update(id, updateJobDto, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.EMPLOYER)
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.jobsService.remove(id, user.id);
  }
}
