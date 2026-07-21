import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Resume {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column()
  publicId: string;

  @Column()
  fileName: string;
}
