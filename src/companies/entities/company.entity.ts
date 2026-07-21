import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  website: string;

  @Column()
  industry: string;

  @Column()
  location: string;

  @Column()
  logo: string;

  @Column()
  size: string;

  @Column({
    default: true,
  })
  verified: boolean;

  //   @Column()
  //   ownerId:
}
