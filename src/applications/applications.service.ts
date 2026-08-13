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
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationType } from 'src/common/enums/notification.type.enum';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepo: Repository<Application>,
    private readonly userService: UsersService,
    private readonly jobService: JobsService,
    private readonly notificationService: NotificationsService,
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

    await this.notificationService.create({
      recipientId: job.company.owner.id,
      title: 'New Job Application',
      message: `${applicant.firstName} ${applicant.lastName} applied for ${job.title}`,
      type: NotificationType.JOB_APPLICATION,
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
        job: {
          company: {
            owner: true,
          },
        },
        applicant: true,
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

    application.status = dto.status;

    await this.notificationService.create({
      recipientId: application.applicant.id,
      title: 'Application Status',
      message: `Application status has been updated to ${application.status}`,
      type: NotificationType.APPLICATION_STATUS,
    });

    return await this.applicationRepo.save(application);
  }

  async remove(id: string, userId: string) {
    const application = await this.findOne(id, userId);
    if (!application) throw new NotFoundException();

    await this.applicationRepo.remove(application);

    await this.notificationService.create({
      recipientId: application.job.company.owner.id,
      title: 'Application Withdrawn',
      message: `${application.applicant.firstName} ${application.applicant.lastName} has withdrawn their application for ${application.job.title}`,
      type: NotificationType.WITHDRAWN,
    });
    return {
      message: 'application withdrawn succeessfully',
    };
  }
}
