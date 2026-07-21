import { ExperienceLevel } from 'src/common/enums/experience-level.enum';
import { EmploymentType } from 'src/common/enums/employment-type.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
