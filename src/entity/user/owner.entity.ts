import { ChildEntity } from 'typeorm';
import { Profile } from './proflle.entity';

@ChildEntity()
export class Owner extends Profile {}
