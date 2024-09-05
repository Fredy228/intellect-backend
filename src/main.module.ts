import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import databaseConfig from './../data-source';
import { ConferenceModule } from './conference/conference.module';
import { WebSocketModule } from './socket/websocket.module';
import { UserModule } from './controllers/user/user.module';
import { GroupModule } from './controllers/group/group.module';
import { UniversityModule } from './controllers/university/university.module';
import { StudentModule } from './controllers/student/student.module';
import { TeacherModule } from './controllers/teacher/teacher.module';
import { SupportMessageModule } from './controllers/support-message/support-message.module';
import { MicroserviceMailModule } from './microservices/mail/microservice-mail.module';
import { MicroserviceAuthModule } from './microservices/auth/microservice-auth.module';
import { SubjectModule } from './controllers/subject/subject.module';

@Module({
  imports: [
    MicroserviceMailModule,
    MicroserviceAuthModule,
    TypeOrmModule.forRoot(databaseConfig.options),
    ScheduleModule.forRoot(),
    UserModule,
    WebSocketModule,
    ConferenceModule,
    GroupModule,
    UniversityModule,
    StudentModule,
    TeacherModule,
    SupportMessageModule,
    SubjectModule,
  ],
  providers: [],
})
export class MainModule {}
