import { HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Student } from '../entity/user/student.entity';
import { CustomException } from '../services/custom-exception';
import { User } from '../entity/user/user.entity';

@Injectable()
export class StudentRepository extends Repository<Student> {
  constructor(private dataSource: DataSource) {
    super(Student, dataSource.createEntityManager());
  }

  async findOneByIdAndUser(user: User, idStudent: number) {
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
      },
    });

    if (!student)
      throw new CustomException(
        HttpStatus.NOT_FOUND,
        `Not found Student ID ${idStudent} in your university`,
      );

    return student;
  }
}
