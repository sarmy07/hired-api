import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Experience } from './entities/experience.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(Experience)
    private readonly experienceRepo: Repository<Experience>,
    private readonly userService: UsersService,
  ) {}

  async create(dto: CreateExperienceDto, userId: string) {
    const user = await this.userService.findOne(userId);

    if (!user) throw new NotFoundException();

    this.validateExperiencesDates(
      dto.startDate,
      dto.endDate,
      dto.currentlyWorking,
    );

    const experience = this.experienceRepo.create({
      ...dto,
      user,
    });

    return await this.experienceRepo.save(experience);
  }

  async findAll(userId: string) {
    return await this.experienceRepo.find({
      where: {
        user: { id: userId },
      },
      order: {
        startDate: 'DESC',
      },
    });
  }

  async findOne(id: string, userId: string) {
    const experience = await this.experienceRepo.findOne({
      where: {
        id,
        user: { id: userId },
      },
    });

    if (!experience) throw new NotFoundException();

    return experience;
  }

  async update(id: string, dto: UpdateExperienceDto, userId: string) {
    const experience = await this.findOne(id, userId);

    const startDate = dto.startDate ?? experience.startDate;

    const endDate = dto.endDate ?? experience.endDate;

    const currentlyWorking =
      dto.currentlyWorking ?? experience.currentlyWorking;
    this.validateExperiencesDates(startDate, endDate, currentlyWorking);

    Object.assign(experience, dto);

    return await this.experienceRepo.save(experience);
  }

  async remove(id: string, userId: string) {
    const experience = await this.findOne(id, userId);

    await this.experienceRepo.remove(experience);

    return {
      message: 'experience has been removed',
    };
  }

  private async validateExperiencesDates(
    startDate?: string | Date,
    endDate?: string | Date | null,
    currentlyWorking?: boolean,
  ) {
    if (currentlyWorking && endDate) {
      throw new BadRequestException(
        'Current experience cannot have an end date',
      );
    }

    if (currentlyWorking === false && !endDate) {
      throw new BadRequestException(
        'End date is required for a completed experience',
      );
    }

    if (startDate && endDate) {
      if (new Date(endDate) < new Date(startDate)) {
        throw new BadRequestException('nd date canntot be before start date');
      }
    }
  }
}
