import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bio: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  phone: string;

  @Column({
    nullable: true,
  })
  github: string;

  @Column({
    nullable: true,
  })
  linkedIn: string;

  @Column({
    nullable: true,
  })
  portofolio: string;

  @Column({
    type: 'varchar',
  })
  address: string;

  @OneToOne(() => User, (u) => u.profile, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
