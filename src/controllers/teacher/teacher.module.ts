import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'lib-intellecta-entity';

import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { TeacherRepository } from '../../repository/teacher.repository';
import { XlsxService } from '../../services/xlsx.service';
import { AuthMiddlewareService } from '../../services/auth-middleware.service';
import { ProtectAuthMiddleware } from '../../middlewares/protect-auth.middleware';
import { UniversityRepository } from '../../repository/university.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    TeacherService,
    TeacherRepository,
    UniversityRepository,
    XlsxService,
    AuthMiddlewareService,
  ],
  controllers: [TeacherController],
})
export class TeacherModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProtectAuthMiddleware).forRoutes(
      {
        path: '/api/teacher/one/:idUniversity',
        method: RequestMethod.POST,
      },
      {
        path: '/api/teacher/many/:idUniversity',
        method: RequestMethod.POST,
      },
      {
        path: '/api/teacher/:idUniversity',
        method: RequestMethod.GET,
      },
      {
        path: '/api/teacher/:idTeacher',
        method: RequestMethod.DELETE,
      },
      {
        path: '/api/teacher/:idTeacher',
        method: RequestMethod.PATCH,
      },
    );
  }
}
