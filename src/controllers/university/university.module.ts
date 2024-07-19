import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UniversityController } from './university.controller';
import { UniversityService } from './university.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProtectAuthMiddleware } from '../../middlewares/protect-auth.middleware';
import { AuthMiddlewareService } from '../../services/auth-middleware.service';
import { User } from '../../entity/user/user.entity';
import { Owner } from '../../entity/user/owner.entity';
import { UniversityRepository } from '../../repository/university.repository';

@Module({
  controllers: [UniversityController],
  providers: [UniversityService, AuthMiddlewareService, UniversityRepository],
  imports: [TypeOrmModule.forFeature([User, Owner])],
})
export class UniversityModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProtectAuthMiddleware).forRoutes(
      {
        path: '/api/university',
        method: RequestMethod.POST,
      },
      {
        path: '/api/university/edbo/university/:edbo',
        method: RequestMethod.POST,
      },
      {
        path: '/api/university/edbo/school/:edbo',
        method: RequestMethod.POST,
      },
      {
        path: '/api/university/:idUniversity',
        method: RequestMethod.PATCH,
      },
      {
        path: '/api/university/:idUniversity',
        method: RequestMethod.GET,
      },
    );
  }
}
