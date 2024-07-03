import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { UniversityRepository } from '../../repository/university.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from '../../entity/group/group.entity';
import { University } from '../../entity/university/university.entity';
import { User } from '../../entity/user/user.entity';
import { Student } from '../../entity/user/student.entity';
import { GroupRepository } from '../../repository/group.repository';

@Module({
  providers: [StudentService, UniversityRepository, GroupRepository],
  controllers: [StudentController],
  imports: [TypeOrmModule.forFeature([User, Student])],
})
export class StudentModule {}
