import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group, University, User } from 'lib-intellecta-entity';

import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { UniversityRepository } from '../../repository/university.repository';
import { ProtectAuthMiddleware } from '../../middlewares/protect-auth.middleware';

@Module({
  controllers: [GroupController],
  providers: [GroupService, UniversityRepository],
  imports: [TypeOrmModule.forFeature([Group, University, User])],
})
export class GroupModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProtectAuthMiddleware).forRoutes(
      {
        path: '/api/group/:idUniversity',
        method: RequestMethod.POST,
      },
      {
        path: '/api/group/:idUniversity',
        method: RequestMethod.GET,
      },
      {
        path: '/api/group/id/:idGroup',
        method: RequestMethod.GET,
      },
      {
        path: '/api/group/:idGroup',
        method: RequestMethod.PATCH,
      },
      {
        path: '/api/group/:idGroup',
        method: RequestMethod.DELETE,
      },
    );
  }
}
