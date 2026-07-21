import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Education {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  school: string;

  @Column()
  degree: string;

  @Column()
  field: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;
}
