import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, UserDevices } from '../../entity/user/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ProtectAuthMiddleware } from '../../middlewares/protect-auth.middleware';
import { AuthMiddlewareService } from '../../services/auth-middleware.service';
import { Profile } from '../../entity/user/proflle.entity';
import { Student } from '../../entity/user/student.entity';
import { Teacher } from '../../entity/user/teacher.entity';
import { Owner } from '../../entity/user/owner.entity';
import { Moderator } from '../../entity/user/admin.entity';

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
