import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Repository } from 'typeorm';
import { CompaniesService } from 'src/companies/companies.service';
import { SkillsService } from 'src/skills/skills.service';
import { FilterJobDto } from './dto/filter-jobs.dto';
import { EmploymentType } from 'src/common/enums/employment-type.enum';
import { ExperienceLevel } from 'src/common/enums/experience-level.enum';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepo: Repository<Job>,
    private readonly companyService: CompaniesService,
    private readonly skillService: SkillsService,
  ) {}

  async create(dto: CreateJobDto, userId: string) {
    const company = await this.companyService.findOne(dto.companyId);
    if (!company) throw new NotFoundException('company not found');

    if (company.owner.id !== userId) {
      throw new ForbiddenException(
        'Only employers of the compnay can perform this action',
      );
    }

    const skills = await this.skillService.findByIds(dto.skillids);

    if (skills.length !== dto.skillids.length) {
      throw new BadRequestException('One or more skills are invalid');
    }

    const job = this.jobRepo.create({
      ...dto,
      company,
      skills,
    });

    return await this.jobRepo.save(job);
  }

  async findAll(query: FilterJobDto) {
    const qb = this.jobRepo
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.company', 'company')
      .leftJoinAndSelect('job.skills', 'skill')
      .where('job.isOpen = :isOpen', { isOpen: true });

    if (query.search) {
      qb.andWhere(
        `(LOWER(job.title) LIKE LOWER(:search) 
          OR LOWER(job.description) LIKE LOWER(:search)
          )`,
        {
          search: `%${query.search}%`,
        },
      );
    }

    if (query.location) {
      qb.andWhere(`LOWER(job.location) LIKE LOWER (:location)`, {
        location: `%${query.location}%`,
      });
    }

    if (query.employmentType) {
      qb.andWhere(`job.employmentType = :employementType`, {
        EmploymentType: query.employmentType,
      });
    }

    if (query.experienceLevel) {
      qb.andWhere(`job.experienceLevel = :experienceLevel`, {
        ExperienceLevel: query.experienceLevel,
      });
    }

    if (query.maxSalary !== undefined) {
      qb.andWhere('job.maxSalary >= :maxSalary', {
        maxSalary: Number(query.maxSalary),
      });
    }

    if (query.minSalary !== undefined) {
      qb.andWhere(`job.minSalary >= :minSalary`, {
        salaryMin: Number(query.minSalary),
      });
    }

    if (query.skill) {
      qb.andWhere('LOWER(skill.name) = LOWER(:skill)', {
        skill: query.skill,
      });
    }

    return qb.getMany();
  }

  async findOne(id: string) {
    const job = await this.jobRepo.findOne({
      where: {
        id,
      },
      relations: {
        company: {
          owner: true,
        },
      },
    });
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  async update(id: string, dto: UpdateJobDto, userId: string) {
    const job = await this.findOne(id);

    if (!job) throw new NotFoundException();

    if (job.company.owner.id !== userId) {
      throw new ForbiddenException(
        'Only employers of the compnay can perform this action',
      );
    }

    // const skills = await this.skillService.findByIds(dto.skillids ?? [])

    if (dto.skillids) {
      const skills = await this.skillService.findByIds(dto.skillids);
      if (skills.length !== dto.skillids?.length) {
        throw new BadRequestException('One or more skills are invalid');
      }
      job.skills = skills;
    }

    Object.assign(job, dto);

    return await this.jobRepo.save(job);
  }

  async remove(id: string, userId: string) {
    const job = await this.findOne(id);
    if (!job) throw new NotFoundException();

    if (job.company.owner.id !== userId) {
      throw new ForbiddenException(
        'Only employers of the company can peform this action',
      );
    }
    await this.jobRepo.remove(job);

    return {
      message: 'Job removed',
    };
  }
}
