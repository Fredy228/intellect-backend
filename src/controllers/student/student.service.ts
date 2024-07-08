import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { UniversityRepository } from '../../repository/university.repository';
import { Student } from '../../entity/user/student.entity';
import { User } from '../../entity/user/user.entity';
import { AddStudentDto } from './student.dto';
import { GroupRepository } from '../../repository/group.repository';
import { CustomException } from '../../services/custom-exception';
import { RoleEnum } from '../../enums/user/role-enum';
import { University } from '../../entity/university/university.entity';
import { QueryGetAllType } from '../../types/query.type';
import { generateFilterList } from '../../services/generate-filter-list';
import { XlsxService } from '../../services/xlsx.service';
import { studentOneCreateSchema } from '../../joi-schema/studentSchema';
import { count } from 'rxjs';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private studentRepository: Repository<Student>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly universityRepository: UniversityRepository,
    private readonly groupRepository: GroupRepository,
    private readonly entityManager: EntityManager,
    private readonly xlsxService: XlsxService,
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
    if (!group)
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        `First you have to create a group`,
      );

    const groupWithUser = await this.groupRepository.findOne({
      where: {
        students: {
          user: {
            id: userToStudent.id,
          },
        },
        university: {
          id: group.university.id,
        },
      },
    });

    if (groupWithUser)
      throw new CustomException(
        HttpStatus.CONFLICT,
        `User already exist in group ${groupWithUser.name}`,
      );

    return this.entityManager.transaction(async (transaction) => {
      const student = transaction.create(Student, {
        group,
        title: `Студент ${group.university.university_short_name}`,
        role: RoleEnum.STUDENT,
        user: userToStudent,
      });

      await transaction.save(Student, student);

      await transaction.update(University, group.university.id, {
        count_students: group.university.count_students + 1,
      });

      return userToStudent;
    });
  }

  async getAll(idUniversity: number, query: QueryGetAllType, idGroup: number) {
    if (!idUniversity)
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        `Wrong id of University ID ${idUniversity}`,
      );

    const university = await this.universityRepository.findOne({
      where: {
        id: idUniversity,
      },
    });
    if (!university)
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        `Not found University ID ${idUniversity}`,
      );

    const options = generateFilterList(query, [
      'email',
      'firstName',
      'lastName',
      'middleName',
    ]);

    const [students, count] = await this.studentRepository.findAndCount({
      where: {
        group: {
          id: idGroup || undefined,
          university: {
            id: university.id,
          },
        },
        user: {
          ...options.filterOption,
        },
      },
      order: options.sortOption,
      ...options.rangeOption,
      relations: {
        user: true,
      },
      select: {
        id: true,
        title: true,
        user: {
          id: true,
          firstName: true,
          lastName: true,
          middleName: true,
          email: true,
          image: true,
          verified: true,
        },
      },
    });

    return {
      data: students,
      total: count,
    };
  }

  async createMany(
    user: User,
    files: Array<Express.Multer.File>,
    groupsId: number[],
    idUniversity: number,
  ) {
    if (!idUniversity)
      throw new CustomException(
        HttpStatus.NOT_FOUND,
        `Wrong id of University ID ${idUniversity}`,
      );

    if (groupsId.length !== files.length)
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        `Incorrect groups or files`,
      );

    const errorRes: {
      [key: number]: Array<{ email?: string; message: string; number: number }>;
    } = {};
    const succsRes: {
      [key: number]: Array<{ email: string; message: string; number: number }>;
    } = {};

    await Promise.all(
      files.map(async (file, index) => {
        const curr_sheet = this.xlsxService.readExcel(file);
        console.log('curr_sheet', curr_sheet);
        await Promise.all(
          curr_sheet.map(async (item, idx) => {
            if ('email' in item && item.email) {
              const { error } = studentOneCreateSchema.validate({
                email: item.email,
              });
              if (error) {
                const prev_err = errorRes[index] || [];
                errorRes[index] = [
                  ...prev_err,
                  {
                    message: 'Incorrect email address',
                    email: item.email,
                    number: idx + 1,
                  },
                ];
              } else {
                try {
                  const addedUser = await this.createOne(
                    user,
                    idUniversity,
                    { email: item.email },
                    groupsId[index],
                  );
                  const prev_succs = succsRes[index] || [];
                  succsRes[index] = [
                    ...prev_succs,
                    {
                      message: 'Successfully added',
                      email: addedUser.email,
                      number: idx + 1,
                    },
                  ];
                } catch (e) {
                  const prev_err = errorRes[index] || [];
                  errorRes[index] = [
                    ...prev_err,
                    {
                      message: `${e?.message}`,
                      email: item.email,
                      number: idx + 1,
                    },
                  ];
                }
              }
            } else {
              const prev_err = errorRes[index] || [];
              errorRes[index] = [
                ...prev_err,
                {
                  message: "You didn't provide an email address",
                  number: idx + 1,
                },
              ];
            }
          }),
        );

        return curr_sheet;
      }),
    );

    return { data: succsRes, error: errorRes };
  }

  async deleteById(user: User, idStudent: number) {
    if (!idStudent)
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        `Wrong id of Student ID ${idStudent}`,
      );

    const student = await this.studentRepository.findOne({
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

    await this.studentRepository.delete(student.id);

    return student;
  }
}
