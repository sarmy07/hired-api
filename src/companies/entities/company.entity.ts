import { Job } from 'src/jobs/entities/job.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  industry: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  size: string;

  @Column({
    default: true,
  })
  verified: boolean;

  @ManyToOne(() => User, (u) => u.companies)
  owner: User;

  @OneToMany(() => Job, (j) => j.company)
  jobs: Job[];

  @CreateDateColumn()
  createdAt: Date;
}
