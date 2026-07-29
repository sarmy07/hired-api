import { Job } from 'src/jobs/entities/job.entity';
import { User } from 'src/users/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['user', 'job'])
export class SavedJob {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => User, (u) => u.savedJobs, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Job, {
    onDelete: 'CASCADE',
  })
  job: Job;

  @CreateDateColumn()
  createdAt: Date;
}
