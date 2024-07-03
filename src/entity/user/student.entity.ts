import { ChildEntity, ManyToOne } from 'typeorm';
import { Profile } from './proflle.entity';
import { Group } from '../group/group.entity';

@ChildEntity()
export class Student extends Profile {
  @ManyToOne(() => Group, (group) => group.students, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  group: Group;
}
