import { Controller, Get, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CurrentUser } from 'src/common/decorators/current.user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';

@ApiBearerAuth()
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.profilesService.findOne(id, user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
    @CurrentUser() user: User,
  ) {
    return this.profilesService.update(id, updateProfileDto, user.id);
  }
}
