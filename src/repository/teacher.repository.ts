import { HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Teacher, User } from 'lib-intellecta-entity';

import { CustomException } from '../services/custom-exception';

@Injectable()
export class TeacherRepository extends Repository<Teacher> {
  constructor(private dataSource: DataSource) {
    super(Teacher, dataSource.createEntityManager());
  }

  async findOneByIdAndUser(user: User, idTeacher: number) {
    if (!idTeacher)
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        `Wrong id of Student ID ${idTeacher}`,
      );

    const teacher = await this.findOne({
      where: [
        {
          id: idTeacher,
          university_teacher: {
            owner: {
              user: {
                id: user.id,
              },
            },
          },
        },
        {
          id: idTeacher,
          university_teacher: {
            moderators: {
              user: {
                id: user.id,
              },
            },
          },
        },
      ],
      relations: {
        university_teacher: true,
      },
      select: {
        university_teacher: {
          id: true,
          university_short_name: true,
          count_teachers: true,
        },
      },
    });

    if (!teacher)
      throw new CustomException(HttpStatus.NOT_FOUND, `Not found Teacher`);

    return teacher;
  }
}
