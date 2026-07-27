import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { Role } from 'src/common/enums/user.role.enum';
import { JobsService } from 'src/jobs/jobs.service';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepo: Repository<Application>,
    private readonly userService: UsersService,
    private readonly jobService: JobsService,
  ) {}

  async create(dto: CreateApplicationDto, userId: string) {
    const applicant = await this.userService.findOne(userId);
    if (!applicant) throw new NotFoundException('applicant not found');

    if (applicant.role !== Role.JOB_SEEKER) {
      throw new BadRequestException('only job seekers can apply for jobs');
    }

    const job = await this.jobService.findOne(dto.jobId);
    if (!job) throw new NotFoundException('job does not exist');

    if (!job.isOpen)
      throw new BadRequestException(
        'job is currently not opened for applicants',
      );

    if (job.company.owner.id === userId) {
      throw new BadRequestException('You can not apply to your own job');
    }

    const duplicateApplication = await this.applicationRepo.findOne({
      where: {
        applicant: {
          id: userId,
        },

        job: {
          id: dto.jobId,
        },
      },
    });

    if (duplicateApplication)
      throw new ConflictException('you have already applied for this job');

    const application = this.applicationRepo.create({
      ...dto,
      applicant,
      job,
    });

    return await this.applicationRepo.save(application);
  }

  async findAllApplicationsForSingleCompany(companyId: string) {
    return await this.applicationRepo.find({
      where: {
        job: {
          company: {
            id: companyId,
          },
        },
      },
      relations: {
        applicant: true,
        job: true,
      },
    });
  }

  async findOne(id: string, userId: string) {
    const application = await this.applicationRepo.findOne({
      where: {
        id,
        applicant: { id: userId },
      },
      relations: {
        job: true,
      },
    });

    if (!application) throw new NotFoundException('application not found');

    return application;
  }

  async update(id: string, dto: UpdateApplicationDto, userId: string) {
    const application = await this.applicationRepo.findOne({
      where: {
        id,
      },
      relations: {
        applicant: true,
        job: {
          company: {
            owner: true,
          },
        },
      },
    });

    if (!application) throw new NotFoundException('application not found');

    if (application?.job.company.owner.id !== userId) {
      throw new ForbiddenException(
        'Only employers of this job can perform this action',
      );
    }

    // Object.assign(application, dto);
    application.status = dto.status;

    return await this.applicationRepo.save(application);
  }

  async remove(id: string, userId: string) {
    const application = await this.findOne(id, userId);
    if (!application) throw new NotFoundException();

    await this.applicationRepo.remove(application);
    return {
      message: 'application withdrawn succeessfully',
    };
  }
}
