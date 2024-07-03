import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { UniversityRepository } from '../../repository/university.repository';
import { Student } from '../../entity/user/student.entity';
import { User } from '../../entity/user/user.entity';
import { AddStudentDto } from './student.dto';
import { GroupRepository } from '../../repository/group.repository';
import { CustomException } from '../../services/custom-exception';
import { RoleEnum } from '../../enums/user/role-enum';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private studentRepository: Repository<Student>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly universityRepository: UniversityRepository,
    private readonly groupRepository: GroupRepository,
  ) {}

  async createOne(
    user: User,
    idUniversity: number,
    { email }: AddStudentDto,
    idGroup: number,
  ): Promise<User> {
    if (!idGroup)
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        `Wrong id of Group ID ${idGroup}`,
      );
    if (!idUniversity)
      throw new CustomException(
        HttpStatus.NOT_FOUND,
        `Wrong id of University ID ${idUniversity}`,
      );

    const userToStudent = await this.userRepository.findOne({
      where: { email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        middleName: true,
        email: true,
        image: true,
        verified: true,
      },
    });
    if (!userToStudent)
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        `User with email ${email} not found`,
      );

    const group = await this.groupRepository.findOneByUser(user, idGroup, true);

    const groupWithUser = await this.groupRepository.findOne({
      where: {
        students: {
          user: userToStudent,
        },
        university: group.university,
      },
    });

    if (groupWithUser)
      throw new CustomException(
        HttpStatus.CONFLICT,
        `User already exist in group ${groupWithUser.name}`,
      );

    const student = this.studentRepository.create({
      group,
      title: `Студент ${group.university.university_short_name}`,
      role: RoleEnum.STUDENT,
    });

    await this.studentRepository.save(student);

    return userToStudent;
  }
}
