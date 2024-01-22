import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { RoleEnum } from '../enums/user/role-enum';

@Entity({ name: 'user' })
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 250, nullable: false })
  password: string;

  @Column({
    type: 'enum',
    enum: RoleEnum,
    nullable: false,
    default: RoleEnum.STUDENT,
  })
  role: RoleEnum;

  @Column({ type: 'varchar', length: 100, nullable: false })
  firstName: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  lastName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  middleName: string;

  @Column({ type: 'tinyint', nullable: true })
  sex: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  image: string;

  @Column({ type: 'tinyint', default: 0, nullable: false })
  verified: number;

  @Column({
    type: 'simple-json',
    default: null,
  })
  settings: {
    restorePassAt: Date | null;
  };

  @Column({
    name: 'createAt',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createAt: Date;

  @OneToMany(() => UserDevices, (device) => device.userId)
  devices: UserDevices[];
}

@Entity({ name: 'user_devices' })
export class UserDevices {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'deviceModel', type: 'varchar', length: 100, nullable: true })
  deviceModel: string;

  @Column({
    name: 'createAt',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createAt: Date;

  @Column({ type: 'varchar', length: 250, nullable: false })
  accessToken: string;

  @Column({ type: 'varchar', length: 250, nullable: false })
  refreshToken: string;

  @ManyToOne(() => User, (user) => user.devices, { onDelete: 'CASCADE' })
  userId: User;
}
