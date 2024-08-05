import { HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Student, User } from 'lib-intellecta-entity';

import { CustomException } from '../services/custom-exception';

@Injectable()
export class StudentRepository extends Repository<Student> {
  constructor(private dataSource: DataSource) {
    super(Student, dataSource.createEntityManager());
  }

  async findOneByIdAndUser(user: User, idStudent: number, withUni?: boolean) {
    if (!idStudent)
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        `Wrong id of Student ID ${idStudent}`,
      );

    const student = await this.findOne({
      where: [
        {
          id: idStudent,
          group: {
            university: {
              owner: {
                user: {
                  id: user.id,
                },
              },
            },
          },
        },
        {
          id: idStudent,
          group: {
            university: {
              moderators: {
                user: {
                  id: user.id,
                },
              },
            },
          },
        },
      ],
      select: {
        id: true,
        title: true,
        role: true,
        group: withUni
          ? {
              id: true,
              name: true,
              university: {
                id: true,
                university_short_name: true,
                count_students: true,
              },
            }
          : undefined,
      },
      relations: withUni
        ? {
            group: {
              university: true,
            },
          }
        : {},
    });

    if (!student)
      throw new CustomException(
        HttpStatus.NOT_FOUND,
        `Not found Student ID ${idStudent} in your university`,
      );

    return student;
  }
}
