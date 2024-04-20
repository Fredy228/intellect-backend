import { ChildEntity } from 'typeorm';
import { Profile } from './proflle.entity';

@ChildEntity()
export class Moderator extends Profile {}
