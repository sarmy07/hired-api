import {
  Controller,
  Get,
  Body,
  Patch,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CurrentUser } from 'src/common/decorators/current.user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from 'src/cloudinary/config/file.validation.pipe';

@ApiBearerAuth()
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findOne(@CurrentUser() user: User) {
    return this.profilesService.findOne(user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Body() updateProfileDto: UpdateProfileDto,
    @CurrentUser() user: User,
  ) {
    return this.profilesService.update(updateProfileDto, user.id);
  }

  @Patch('avatar')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  updateProfileAvatar(
    @CurrentUser() user: User,
    @UploadedFile(new FileValidationPipe())
    file: Express.Multer.File,
  ) {
    return this.profilesService.updateProfileAvatar(user.id, file);
  }
}
