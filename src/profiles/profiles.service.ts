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
}
