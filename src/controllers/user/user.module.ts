import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  User,
  UserDevices,
  Profile,
  Student,
  Teacher,
  Owner,
  Moderator,
} from 'lib-intellecta-entity';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ProtectAuthMiddleware } from '../../middlewares/protect-auth.middleware';
import { AuthMiddlewareService } from '../../services/auth-middleware.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserDevices,
      Profile,
      Student,
      Teacher,
      Owner,
      Moderator,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, AuthMiddlewareService],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProtectAuthMiddleware).forRoutes(
      {
        path: '/api/user',
        method: RequestMethod.GET,
      },
      {
        path: '/api/user/profile',
        method: RequestMethod.GET,
      },
      {
        path: '/api/user',
        method: RequestMethod.PATCH,
      },
      {
        path: '/api/user/create/maker-228',
        method: RequestMethod.POST,
      },
    );
  }
}
