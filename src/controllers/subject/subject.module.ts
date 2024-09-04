import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { SubjectController } from './subject.controller';
import { SubjectRepository } from '../../repository/subject.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'lib-intellecta-entity';
import { UniversityRepository } from '../../repository/university.repository';
import { ProtectAuthMiddleware } from '../../middlewares/protect-auth.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [SubjectService, SubjectRepository, UniversityRepository],
  controllers: [SubjectController],
})
export class SubjectModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProtectAuthMiddleware).forRoutes(
      {
        path: '/api/subject/one/:idUniversity',
        method: RequestMethod.POST,
      },
      {
        path: '/api/subject/many/:idUniversity',
        method: RequestMethod.POST,
      },
      {
        path: '/api/subject/:idUniversity',
        method: RequestMethod.GET,
      },
      {
        path: '/api/subject/id/:idSubject',
        method: RequestMethod.GET,
      },
      {
        path: '/api/subject/:idSubject',
        method: RequestMethod.DELETE,
      },
      {
        path: '/api/subject/:idSubject',
        method: RequestMethod.PATCH,
      },
    );
  }
}
