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
import { ExperienceService } from './experience.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { CurrentUser } from 'src/common/decorators/current.user.decorator';
import { User } from 'src/users/entities/user.entity';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('experience')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Post()
  create(
    @Body() createExperienceDto: CreateExperienceDto,
    @CurrentUser() user: User,
  ) {
    return this.experienceService.create(createExperienceDto, user.id);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.experienceService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.experienceService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExperienceDto: UpdateExperienceDto,
    @CurrentUser() user: User,
  ) {
    return this.experienceService.update(id, updateExperienceDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.experienceService.remove(id, user.id);
  }
}
