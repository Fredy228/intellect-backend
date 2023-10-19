import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';
import { RoleEnum } from '../../enums/user/role-enum';

@Entity()
@Unique(['email']) // Уникальный индекс для столбца 'email'
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'enum', enum: RoleEnum })
  role: RoleEnum;

  @Column({ type: 'tinyint' })
  sex: number;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  middleName: string | null;

  @Column({ type: 'datetime' })
  birthday: Date;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  photo: string | null;
}
