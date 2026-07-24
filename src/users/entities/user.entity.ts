import { Role } from 'src/common/enums/user.role.enum';
import { Company } from 'src/companies/entities/company.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
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

  @Column()
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
  isVerified: boolean;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  avatar: string | null;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  refreshToken: string;

  @OneToMany(() => Company, (c) => c.owner)
  companies: Company[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
