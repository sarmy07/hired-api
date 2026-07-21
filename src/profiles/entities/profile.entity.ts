import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
