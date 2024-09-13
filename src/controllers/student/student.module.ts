import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Student } from 'lib-intellecta-entity';

import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { UniversityRepository } from '../../repository/university.repository';
import { GroupRepository } from '../../repository/group.repository';
import { ProtectAuthMiddleware } from '../../middlewares/protect-auth.middleware';
import { XlsxService } from '../../services/xlsx.service';
import { StudentRepository } from '../../repository/student.repository';

@Module({
  providers: [
    StudentService,
    UniversityRepository,
    GroupRepository,
    XlsxService,
    StudentRepository,
  ],
  controllers: [StudentController],
  imports: [TypeOrmModule.forFeature([User, Student])],
})
export class StudentModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProtectAuthMiddleware).forRoutes(
      {
        path: '/api/student/one/:idGroup',
        method: RequestMethod.POST,
      },
      {
        path: '/api/student/many/:idUniversity',
        method: RequestMethod.POST,
      },
      {
        path: '/api/student/:idUniversity',
        method: RequestMethod.GET,
      },
      {
        path: '/api/student/:idStudent',
        method: RequestMethod.DELETE,
      },
      {
        path: '/api/student/:idStudent',
        method: RequestMethod.PATCH,
      },
    );
  }
}
