import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';
import { User } from './user.entity';
import { RoleEnum } from '../../enums/user/role-enum';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'profile' })
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class Profile {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string;

  @ApiProperty({
    type: 'enum',
    example: 'student | teacher | owner_university | moder_university',
  })
  @Column({
    type: 'enum',
    enum: RoleEnum,
    nullable: false,
  })
  role: RoleEnum;

  @ApiProperty()
  @Column({
    name: 'createAt',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createAt: Date;

  @ApiProperty()
  @Column({
    name: 'updateAt',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updateAt: Date;

  @ManyToOne(() => User, (user) => user.profiles, { onDelete: 'CASCADE' })
  user: User;
}
