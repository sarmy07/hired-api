import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Education } from './entities/education.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class EducationService {
  constructor(
    @InjectRepository(Education)
    private readonly educationRepo: Repository<Education>,
    private readonly userService: UsersService,
  ) {}

  async create(dto: CreateEducationDto, userId: string) {
    const user = await this.userService.findOne(userId);
    if (!user) throw new NotFoundException();

    const education = this.educationRepo.create({
      ...dto,
      user,
    });

    return this.educationRepo.save(education);
  }

  async findAll(userId: string) {
    return await this.educationRepo.find({
      where: {
        user: { id: userId },
      },
    });
  }

  async findOne(id: string, userId: string) {
    const education = await this.educationRepo.findOne({
      where: {
        id,
        user: { id: userId },
      },
    });
    if (!education) throw new NotFoundException();

    return education;
  }

  async update(id: string, dto: UpdateEducationDto, userId: string) {
    const education = await this.findOne(id, userId);

    Object.assign(education, dto);

    return await this.educationRepo.save(education);
  }

  async remove(id: string, userId: string) {
    const education = await this.findOne(id, userId);

    await this.educationRepo.remove(education);

    return {
      message: 'education has been removed',
    };
  }
}
