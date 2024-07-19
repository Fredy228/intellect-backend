import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user/user.entity';
import { ESupportMessagesStatus } from '../enums/user/support-messages.enum';

@Entity({ name: 'support_message' })
export class SupportMessage {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100, nullable: false })
  email: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 500, nullable: false })
  title: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: false })
  message: string;

  @ApiProperty({
    type: 'enum',
    example: Object.values(ESupportMessagesStatus).join(' | '),
  })
  @Column({
    type: 'enum',
    enum: ESupportMessagesStatus,
    nullable: false,
    default: ESupportMessagesStatus.CREATED,
  })
  status: ESupportMessagesStatus;

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

  @ManyToOne(() => User, (user) => user.supportMessages, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  user: User;
}
