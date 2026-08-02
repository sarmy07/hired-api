import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateSavedJobDto } from './dto/create-saved-job.dto';
import { UpdateSavedJobDto } from './dto/update-saved-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SavedJob } from './entities/saved-job.entity';
import { Repository } from 'typeorm';
import { JobsService } from 'src/jobs/jobs.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SavedJobsService {
  constructor(
    @InjectRepository(SavedJob)
    private readonly savedJobRepo: Repository<SavedJob>,
    private readonly jobService: JobsService,
    private readonly userService: UsersService,
  ) {}

  async saveJob(dto: CreateSavedJobDto, userId: string) {
    const job = await this.jobService.findOne(dto.jobId);
    if (!job) return null;

    if (!job.isOpen) {
      throw new BadRequestException('only job that aee oped can be saved');
    }

    const user = await this.userService.findOne(userId);
    if (!user) return null;

    if (job.company.owner.id === userId) {
      throw new ForbiddenException('you cannot save your own job');
    }

    const existing = await this.savedJobRepo.findOne({
      where: {
        user: {
          id: userId,
        },
        job: {
          id: dto.jobId,
        },
      },
    });

    if (existing)
      throw new ConflictException('you have already saved this job');

    return await this.savedJobRepo.create({
      user,
      job,
    });
  }

  create(dto: CreateSavedJobDto) {
    return 'This action adds a new savedJob';
  }

  async findAllMySavedJobs(userId: string) {
    return await this.savedJobRepo.find({
      where: {
        user: { id: userId },
      },
      relations: {
        job: {
          company: true,
          skills: true,
        },
      },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    return await this.savedJobRepo.findOne({
      where: {
        id,
      },
      relations: {
        user: true,
      },
    });
  }

  update(id: number, updateSavedJobDto: UpdateSavedJobDto) {
    return `This action updates a #${id} savedJob`;
  }

  async remove(id: string, userId: string) {
    const savedJob = await this.findOne(id);
    if (!savedJob) return null;

    if (savedJob.user.id! === userId) {
      throw new ForbiddenException();
    }

    await this.savedJobRepo.remove(savedJob);
    return {
      message: 'saved-job removed successfully',
    };
  }
}
