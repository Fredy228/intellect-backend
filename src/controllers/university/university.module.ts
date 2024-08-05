import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Owner, Moderator } from 'lib-intellecta-entity';

import { UniversityController } from './university.controller';
import { UniversityService } from './university.service';
import { ProtectAuthMiddleware } from '../../middlewares/protect-auth.middleware';
import { AuthMiddlewareService } from '../../services/auth-middleware.service';
import { UniversityRepository } from '../../repository/university.repository';

@Module({
  controllers: [UniversityController],
  providers: [UniversityService, AuthMiddlewareService, UniversityRepository],
  imports: [TypeOrmModule.forFeature([User, Owner, Moderator])],
})
export class UniversityModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProtectAuthMiddleware).forRoutes(
      {
        path: '/api/university',
        method: RequestMethod.POST,
      },
      {
        path: '/api/university/admin/:idUniversity',
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
