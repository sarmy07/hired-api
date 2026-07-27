import { ApplicationStatus } from 'src/common/enums/application.status.enum';
import { Job } from 'src/jobs/entities/job.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  coverLetter: string;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING,
  })
  status: ApplicationStatus;

  @Column({
    nullable: true,
  })
  resumeSnapshot: string;

  @ManyToOne(() => User, (u) => u.applications, {
    onDelete: 'SET NULL',
  })
  applicant: User;

  @ManyToOne(() => Job, (j) => j.applications, {
    onDelete: 'CASCADE',
  })
  job: Job;

  @CreateDateColumn()
  createdAt: Date;
}
