import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UserSetting } from '../types/user-type';
import { Profile } from './proflle.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'user' })
@Unique(['email'])
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100, nullable: false })
  email: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 250, nullable: false })
  password: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100, nullable: false })
  firstName: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100, nullable: false })
  lastName: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100, nullable: true })
  middleName: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @ApiProperty()
  @Column({ type: 'smallint', nullable: true })
  sex: 0 | 1;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100, nullable: true })
  image: string;

  @ApiProperty()
  @Column({ type: 'boolean', default: false, nullable: false })
  verified: boolean;

  @ApiProperty({
    type: 'object',
    example: {
      restorePassAt: 'Date | null',
      code: 'string',
    },
  })
  @Column({
    type: 'jsonb',
    // array: false,
    // default: () => "'{restorePassAt: null, code: null}'",
    // nullable: false,
  })
  settings: UserSetting;

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

  @ApiProperty({
    type: () => [UserDevices],
  })
  @OneToMany(() => UserDevices, (device) => device.user, {
    onDelete: 'NO ACTION',
  })
  devices: UserDevices[];

  @ApiProperty({
    type: () => [Profile],
  })
  @OneToMany(() => Profile, (profile) => profile.user, {
    onDelete: 'NO ACTION',
  })
  profiles: Profile[];
}

@Entity({ name: 'user_devices' })
export class UserDevices {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ name: 'deviceModel', type: 'varchar', length: 100, nullable: true })
  deviceModel: string;

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

  @ApiProperty()
  @Column({ type: 'varchar', length: 250, nullable: false })
  accessToken: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 250, nullable: false })
  refreshToken: string;

  @ManyToOne(() => User, (user) => user.devices, { onDelete: 'CASCADE' })
  user: User;
}
