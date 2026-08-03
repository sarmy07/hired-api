import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Company } from 'src/companies/entities/company.entity';
import { Job } from 'src/jobs/entities/job.entity';
import { Application } from 'src/applications/entities/application.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,

    @InjectRepository(Job)
    private readonly jobRepo: Repository<Job>,

    @InjectRepository(Application)
    private readonly applicationRepo: Repository<Application>,
  ) {}

  async findAllUsers() {
    return await this.userRepo.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(userId: string) {
    const user = await this.userRepo.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) throw new NotFoundException();

    return user;
  }

  async blockAndUnblockUser(userId: string) {
    const user = await this.findOne(userId);

    user.isActive = !user.isActive;
    return this.userRepo.save(user);
  }

  async remove(userId: string) {
    return this.userRepo.delete(userId);
  }

  async findAllCompanies() {
    return await this.companyRepo.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findSingleCompany(id: string) {
    const company = await this.companyRepo.findOne({
      where: {
        id,
      },
    });
    if (!company) throw new NotFoundException();

    return company;
  }

  async deleteCompany(id: string) {
    return this.companyRepo.delete(id);
  }

  async findAllJobs() {
    return await this.jobRepo.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findSingleJob(jobId: string) {
    const job = await this.jobRepo.findOne({
      where: {
        id: jobId,
      },
    });

    if (!job) throw new NotFoundException();
    return job;
  }

  async openCloseJobs(jobId: string) {
    const job = await this.findSingleJob(jobId);

    job.isOpen = !job.isOpen;

    return await this.jobRepo.save(job);
  }

  async deleteJob(jobId) {
    return this.jobRepo.delete(jobId);
  }
}
