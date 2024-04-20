import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UserAction, UserSetting } from '../../types/user-type';
import { Profile } from './proflle.entity';
import { ApiProperty } from '@nestjs/swagger';
import { CountryCode } from 'libphonenumber-js/types';

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
  @Column({ type: 'jsonb', nullable: true, default: null })
  phone: {
    country: CountryCode;
    number: string;
  } | null;

  @ApiProperty()
  @Column({ type: 'date', nullable: true })
  birthday: Date;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100, nullable: true })
  bio: string;

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
      profileDefault: 'number | null',
    },
  })
  @Column({
    type: 'jsonb',
  })
  settings: UserSetting;

  @ApiProperty({
    type: 'object',
    example: {
      timeAt: 'Date | null',
      code: 'null',
      numberTries: 'number',
    },
  })
  @Column({
    type: 'jsonb',
  })
  actions: UserAction;

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
