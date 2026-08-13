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
import { AddJobSkillDto } from './dto/add-job-skill.dto';
import { User } from 'src/users/entities/user.entity';

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

    qb.orderBy(`job.${query.sortBy ?? 'createdAt'}`, query.order ?? 'DESC');

    // const { page, limit } = query;
    // const skip = (page - 1) * limit;

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    qb.skip((page - 1) * limit).take(limit);
    const [jobs, total] = await qb.getManyAndCount();
    return {
      data: jobs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
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
        skills: true,
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

    if (dto.skillids) {
      const skills = await this.skillService.findByIds(dto.skillids);

      if (skills.length !== dto.skillids?.length) {
        throw new BadRequestException('One or more skills are invalid');
      }

      // const existingSkills = new Set(job.skills?.map((skill) => skill.id));

      // const newSkills = skills.filter((skill) => !existingSkills.has(skill.id));

      // job.skills = [...job.skills, ...newSkills];
      job.skills = skills;
    }

    const { skillids, ...jobData } = dto;
    Object.assign(job, jobData);

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

  async addSkills(jobId: string, userId: string, dto: AddJobSkillDto) {
    const job = await this.findOne(jobId);
    if (!job) throw new NotFoundException();

    if (job.company.owner.id !== userId) {
      throw new ForbiddenException(
        'only the employer of this company can add skills',
      );
    }

    const skills = await this.skillService.findByIds(dto.skillIds);

    if (skills.length !== dto.skillIds.length) {
      throw new BadRequestException('One or more skills are invalid');
    }

    const existingSkills = new Set(job.skills.map((skill) => skill.id));

    const newSkills = skills.filter((skills) => !existingSkills.has(skills.id));

    job.skills = [...job.skills, ...newSkills];

    return await this.jobRepo.save(job);
  }

  async removeSkill(userId: string, jobId: string, skillId: string) {
    const job = await this.findOne(jobId);
    if (!job) throw new NotFoundException();

    if (job.company.owner.id !== userId) {
      throw new ForbiddenException(
        'Only employers of the company can remove skills',
      );
    }

    const someSkills = job.skills.some((skill) => skill.id === skillId);

    if (!someSkills) {
      throw new NotFoundException('This skill is not attached to the job');
    }

    job.skills = job.skills.filter((skill) => skill.id !== skillId);

    return await this.jobRepo.save(job);
  }
}
