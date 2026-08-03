/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from 'src/applications/entities/application.entity';
import { ApplicationStatus } from 'src/common/enums/application.status.enum';
import { Company } from 'src/companies/entities/company.entity';
import { Job } from 'src/jobs/entities/job.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import { SavedJob } from 'src/saved-jobs/entities/saved-job.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepo: Repository<Application>,

    @InjectRepository(Job)
    private readonly JobRepo: Repository<Job>,

    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,

    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,

    @InjectRepository(SavedJob)
    private readonly savedJobRepo: Repository<SavedJob>,
  ) {}

  async getEmployerDashboard(userId: string) {
    const [
      companies,
      activeJobs,
      totalApplications,
      closedJobs,
      unreadNotifications,
    ] = await Promise.all([
      this.companyRepo.count({
        where: {
          owner: {
            id: userId,
          },
        },
      }),

      this.JobRepo.count({
        where: {
          isOpen: true,
          company: {
            owner: {
              id: userId,
            },
          },
        },
      }),

      this.applicationRepo.count({
        where: {
          job: {
            company: {
              owner: {
                id: userId,
              },
            },
          },
        },
      }),

      this.JobRepo.count({
        where: {
          isOpen: false,
          company: {
            owner: {
              id: userId,
            },
          },
        },
      }),

      this.notificationRepo.count({
        where: {
          isRead: false,
          recipient: {
            id: userId,
          },
        },
      }),
    ]);

    return {
      companies,
      activeJobs,
      totalApplications,
      closedJobs,
      unreadNotifications,
    };
  }

  private countApplicationByStatus(userId: string, status: ApplicationStatus) {
    return this.applicationRepo.count({
      where: {
        applicant: {
          id: userId,
        },
        status,
      },
    });
  }

  async getJobSeekeDashboard(userId: string) {
    const [
      applications,
      pendingApplications,
      reviewedApplications,
      interviewApplications,
      rejectedApplications,
      offeredApplications,
      savedJobs,
      unreadNotifications,
      recentApplications,
    ] = await Promise.all([
      this.applicationRepo.count({
        where: {
          applicant: {
            id: userId,
          },
        },
      }),

      this.countApplicationByStatus(userId, ApplicationStatus.PENDING),
      this.countApplicationByStatus(userId, ApplicationStatus.REVIEWING),
      this.countApplicationByStatus(userId, ApplicationStatus.INTERVIEW),
      this.countApplicationByStatus(userId, ApplicationStatus.REJECTED),
      this.countApplicationByStatus(userId, ApplicationStatus.OFFERED),

      this.savedJobRepo.count({
        where: {
          user: {
            id: userId,
          },
        },
      }),

      this.notificationRepo.count({
        where: {
          isRead: false,
          recipient: {
            id: userId,
          },
        },
      }),

      this.applicationRepo.find({
        where: {
          applicant: {
            id: userId,
          },
        },

        relations: {
          job: {
            company: true,
          },
        },
        order: {
          createdAt: 'DESC',
        },
        take: 5,
      }),
    ]);

    return {
      applications,
      pendingApplications,
      reviewedApplications,
      interviewApplications,
      rejectedApplications,
      offeredApplications,
      savedJobs,
      unreadNotifications,
      recentApplications,
    };
  }

  async getAdminDashboard() {}
}
