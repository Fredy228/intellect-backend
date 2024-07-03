import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CountryCode } from 'libphonenumber-js/types';

import { Faculty } from './faculty.entity';
import { Group } from '../group/group.entity';
import { Teacher } from '../user/teacher.entity';
import { Moderator } from '../user/admin.entity';
import { Owner } from '../user/owner.entity';

@Entity({ name: 'university' })
export class University {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'integer', nullable: true })
  university_id: number;

  @ApiProperty()
  @Column({ type: 'integer', nullable: true })
  university_parent_id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 300, nullable: false })
  university_name: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100, nullable: false })
  university_short_name: string;

  //type ??
  //address ??

  @ApiProperty()
  @Column({ type: 'integer', nullable: true })
  registration_year: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 10, nullable: true })
  post_index_u: string;

  @ApiProperty()
  @Column({ type: 'jsonb', nullable: true, default: [] })
  contacts: Array<{
    title: string;
    country: CountryCode;
    number: string;
  }>;

  @ApiProperty()
  @Column({ type: 'varchar', length: 250, nullable: true })
  university_site: string;

  @ApiProperty()
  @Column({ type: 'integer', nullable: false, default: 0 })
  count_students: number;

  @ApiProperty()
  @Column({ type: 'integer', nullable: false, default: 0 })
  count_teachers: number;

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

  @ApiProperty({
    type: () => [Faculty],
  })
  @OneToMany(() => Faculty, (faculty) => faculty.university)
  faculties: Faculty[];

  @ApiProperty({
    type: () => [Teacher],
  })
  @OneToMany(() => Teacher, (teacher) => teacher.university)
  teachers: Teacher[];

  @ApiProperty({
    type: () => [Moderator],
  })
  @OneToMany(() => Moderator, (moderator) => moderator.university)
  moderators: Moderator[];

  @ApiProperty({
    type: () => [Group],
  })
  @OneToMany(() => Group, (group) => group.university)
  groups: Group[];

  @ApiProperty()
  @OneToOne(() => Owner, (owner) => owner.university)
  @JoinColumn()
  owner: Owner;
}
