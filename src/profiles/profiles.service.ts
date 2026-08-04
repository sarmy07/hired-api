import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
    private readonly userService: UsersService,
  ) {}

  async findOne(id: string, userId: string) {
    const user = await this.userService.findOne(userId);
    if (!user) return null;

    const profile = await this.profileRepo.findOne({
      where: {
        id,
        user: {
          id: userId,
        },
      },
    });

    if (!profile) throw new NotFoundException();

    return profile;
  }

  async update(id: string, dto: UpdateProfileDto, userId: string) {
    const profile = await this.findOne(id, userId);
    if (!profile) return null;

    Object.assign(profile, dto);

    return await this.profileRepo.save(profile);
  }
}
