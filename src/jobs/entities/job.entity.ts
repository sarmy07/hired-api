import { ExperienceLevel } from 'src/common/enums/experience-level.enum';
import { EmploymentType } from 'src/common/enums/employment-type.enum';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Company } from 'src/companies/entities/company.entity';
import { Skill } from 'src/skills/entities/skill.entity';

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
    type: 'int',
    nullable: true,
  })
  salaryMin: number;

  @Column({
    type: 'int',
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

  //   @Column()
  //   remoteType:

  @Column()
  deadline: string;

  @ManyToOne(() => Company, (c) => c.jobs)
  company: Company;

  @ManyToMany(() => Skill)
  @JoinTable()
  skills: Skill[];
}
