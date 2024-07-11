import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { UniversityRepository } from '../../repository/university.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from '../../entity/group/group.entity';
import { University } from '../../entity/university/university.entity';
import { User } from '../../entity/user/user.entity';
import { Student } from '../../entity/user/student.entity';
import { GroupRepository } from '../../repository/group.repository';
import { ProtectAuthMiddleware } from '../../middlewares/protect-auth.middleware';
import { AuthMiddlewareService } from '../../services/auth-middleware.service';
import { XlsxService } from '../../services/xlsx.service';
import { StudentRepository } from '../../repository/student.repository';

@Module({
  providers: [
    StudentService,
    UniversityRepository,
    GroupRepository,
    AuthMiddlewareService,
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
        path: '/api/student/one/:idUniversity',
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
