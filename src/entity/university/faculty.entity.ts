import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { University } from './university.entity';

@Entity({ name: 'faculty' })
export class Faculty {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 250, nullable: false })
  name: string;

  @ManyToOne(() => University, (university) => university.faculties, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  university: University;
}
