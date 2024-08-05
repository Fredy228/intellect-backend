import { User } from 'lib-intellecta-entity';

export type ReqProtectedType = {
  user: User;
} & Request;
