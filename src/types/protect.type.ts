import { User } from '../entity/user/user.entity';

export type ReqProtectedType = {
  user: User;
} & Request;
