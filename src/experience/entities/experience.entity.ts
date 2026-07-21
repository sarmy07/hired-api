import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Experience {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  company: string;

  @Column()
  position: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  currentlyWorking: boolean;

  @Column()
  description: string;
}
