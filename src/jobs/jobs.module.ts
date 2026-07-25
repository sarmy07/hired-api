import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { CompaniesModule } from 'src/companies/companies.module';
import { SkillsModule } from 'src/skills/skills.module';

@Module({
  imports: [TypeOrmModule.forFeature([Job]), SkillsModule, CompaniesModule],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
