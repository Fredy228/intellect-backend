import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { University } from '../university/university.entity';
import { Student } from '../user/student.entity';

@Entity({ name: 'group' })
export class Group {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 250, nullable: false })
  name: string;

  @ApiProperty()
  @Column({ type: 'smallint', nullable: true })
  level: number;

  @ApiProperty()
  @Column({ type: 'date', nullable: true })
  start_date: Date;

  @ApiProperty()
  @Column({ type: 'date', nullable: true })
  end_date: Date;

  @ApiProperty()
  @CreateDateColumn({
    name: 'createAt',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createAt: Date;

  @ApiProperty()
  @UpdateDateColumn({
    name: 'updateAt',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updateAt: Date;

  @ManyToOne(() => University, (university) => university.groups, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  university: University;

  @OneToMany(() => Student, (student) => student.group)
  students: Student[];
}
