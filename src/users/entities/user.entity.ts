import { application } from 'express';
import { Application } from 'src/applications/entities/application.entity';
import { Role } from 'src/common/enums/user.role.enum';
import { Company } from 'src/companies/entities/company.entity';
import { Education } from 'src/education/entities/education.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import { Profile } from 'src/profiles/entities/profile.entity';
import { SavedJob } from 'src/saved-jobs/entities/saved-job.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    // default: Role.JOB_SEEKER,
  })
  role: Role;

  @Column({
    default: true,
  })
  isActive: boolean;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  refreshToken: string;

  @OneToMany(() => Company, (c) => c.owner)
  companies: Company[];

  @OneToMany(() => Application, (a) => a.applicant)
  applications: Application[];

  @OneToMany(() => Notification, (n) => n.recipient)
  notifications: Notification[];

  @OneToMany(() => SavedJob, (sj) => sj.user)
  savedJobs: SavedJob[];

  @OneToOne(() => Profile, (p) => p.user)
  profile: Profile;

  @OneToMany(() => Education, (e) => e.user)
  educations: Education[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
