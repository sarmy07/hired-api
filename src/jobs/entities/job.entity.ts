import { ExperienceLevel } from 'src/common/enums/experience-level.enum';
import { EmploymentType } from 'src/common/enums/employment-type.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Company } from 'src/companies/entities/company.entity';
import { Skill } from 'src/skills/entities/skill.entity';
import { Application } from 'src/applications/entities/application.entity';
import { SavedJob } from 'src/saved-jobs/entities/saved-job.entity';
import { Category } from 'src/categories/entities/category.entity';

@Entity()
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: EmploymentType,
  })
  employmentType: EmploymentType;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  salaryMin: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  salaryMax: number;

  @Column({
    type: 'enum',
    enum: ExperienceLevel,
  })
  experienceLevel: ExperienceLevel;

  @Column({ default: true })
  isOpen: boolean;

  @Column()
  location: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  deadline: Date;

  @Column('text', {
    nullable: true,
  })
  responsibilities: string;

  @Column('text', {
    nullable: true,
  })
  requirements: string;

  @ManyToOne(() => Company, (c) => c.jobs, {
    onDelete: 'CASCADE',
  })
  company: Company;

  @ManyToMany(() => Skill)
  @JoinTable()
  skills: Skill[];

  @OneToMany(() => Application, (a) => a.job)
  applications: Application[];

  @OneToMany(() => SavedJob, (sj) => sj.job)
  job: SavedJob;

  @ManyToOne(() => Category, (c) => c.jobs, {
    onDelete: 'RESTRICT',
    nullable: true,
  })
  category: Category;

  @CreateDateColumn()
  createdAt: Date;
}
