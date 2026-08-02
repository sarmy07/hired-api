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
import { SavedJobsService } from './saved-jobs.service';
import { CreateSavedJobDto } from './dto/create-saved-job.dto';
import { UpdateSavedJobDto } from './dto/update-saved-job.dto';
import { CurrentUser } from 'src/common/decorators/current.user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/user.role.enum';

@ApiBearerAuth()
@Controller('saved-jobs')
export class SavedJobsController {
  constructor(private readonly savedJobsService: SavedJobsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.JOB_SEEKER)
  saveJob(@Body() dto: CreateSavedJobDto, @CurrentUser() user: User) {
    return this.savedJobsService.saveJob(dto, user.id);
  }

  @Post()
  create(@Body() createSavedJobDto: CreateSavedJobDto) {
    return this.savedJobsService.create(createSavedJobDto);
  }

  @Get('saved-jobs')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.JOB_SEEKER)
  findAllMySavedJobs(@CurrentUser() user: User) {
    return this.savedJobsService.findAllMySavedJobs(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.savedJobsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSavedJobDto: UpdateSavedJobDto,
  ) {
    return this.savedJobsService.update(+id, updateSavedJobDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.JOB_SEEKER)
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.savedJobsService.remove(id, user.id);
  }
}
