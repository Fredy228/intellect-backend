import { ChildEntity, Column, ManyToOne } from 'typeorm';
import { Profile } from './proflle.entity';
import { ApiProperty } from '@nestjs/swagger';
import { University } from '../university/university.entity';

@ChildEntity()
export class Teacher extends Profile {
  @ApiProperty()
  @Column({ type: 'varchar', length: 250, nullable: false })
  job_title: string;

  @ManyToOne(() => University, (university) => university.teachers, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  university: University;
}
