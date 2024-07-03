import { ChildEntity, ManyToOne } from 'typeorm';
import { Profile } from './proflle.entity';
import { University } from '../university/university.entity';

@ChildEntity()
export class Moderator extends Profile {
  @ManyToOne(() => University, (university) => university.moderators, {
    onDelete: 'CASCADE',
  })
  university: University;
}
