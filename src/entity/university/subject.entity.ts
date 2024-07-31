import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { University } from './university.entity';

@Entity({ name: 'subject' })
export class Subject {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 300, nullable: false })
  name: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 300, nullable: false })
  short_name: string;

  @ManyToOne(() => University, (university) => university.subjects, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  university: University;
}
