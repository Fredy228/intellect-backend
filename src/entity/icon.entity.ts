import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { EIconGroup, EIconType } from '../enums/icon.enum';

@Entity({ name: 'icon' })
export class Icon {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 300, nullable: false })
  name: string;

  @ApiProperty({
    type: 'enum',
    example: Object.values(EIconType).join(' | '),
  })
  @Column({
    type: 'enum',
    enum: EIconType,
    nullable: false,
  })
  type: EIconType;

  @ApiProperty({
    type: 'enum',
    example: Object.values(EIconGroup).join(' | '),
  })
  @Column({
    type: 'enum',
    enum: EIconGroup,
    nullable: true,
  })
  group: EIconGroup;

  @ApiProperty()
  @Column({ type: 'varchar', length: 500, nullable: false })
  path: string;
}
