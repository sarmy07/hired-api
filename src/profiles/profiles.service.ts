import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { CloduinaryProvider } from 'src/cloudinary/cloudinary.provider';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
    private readonly userService: UsersService,
    private readonly cloduinaryProvider: CloduinaryProvider,
  ) {}

  async findOne(userId: string) {
    const profile = await this.profileRepo.findOne({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        user: true,
      },
    });

    if (!profile) throw new NotFoundException();

    return profile;
  }

  async update(dto: UpdateProfileDto, userId: string) {
    const profile = await this.findOne(userId);
    if (!profile) return null;

    Object.assign(profile, dto);

    return await this.profileRepo.save(profile);
  }

  async updateProfileAvatar(userId: string, file: Express.Multer.File) {
    const user = await this.userService.findOne(userId);
    if (!user) throw new NotFoundException();

    let profile = await this.findOne(userId);
    if (profile?.avatar) {
      await this.cloduinaryProvider.deleteImage(profile.avatarId);
    }

    const result = await this.cloduinaryProvider.uploadImage(
      file,
      'blog-posts',
    );

    profile.avatar = result.secure_url;
  }
}
