import { ChildEntity, OneToOne } from 'typeorm';
import { Profile } from './proflle.entity';
import { University } from '../university/university.entity';

@ChildEntity()
export class Owner extends Profile {
  @OneToOne(() => University, (university) => university.owner, {
    onDelete: 'CASCADE',
  })
  university: University;
}
