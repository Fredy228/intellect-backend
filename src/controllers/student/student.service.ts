import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import {
  Student,
  User,
  RoleEnum,
  University,
  Group,
} from 'lib-intellecta-entity';

import { UniversityRepository } from '../../repository/university.repository';
import { AddStudentDto, UpdateGroupStudentDto } from './student.dto';
import { GroupRepository } from '../../repository/group.repository';
import { CustomException } from '../../services/custom-exception';
import { QueryGetAllType } from '../../types/query.type';
import { generateFilterList } from '../../services/generate-filter-list';
import { XlsxService } from '../../services/xlsx.service';
import { studentOneCreateSchema } from '../../joi-schema/student.schema';
import { StudentRepository } from '../../repository/student.repository';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly studentRepository: StudentRepository,
    private readonly universityRepository: UniversityRepository,
    private readonly groupRepository: GroupRepository,
    private readonly entityManager: EntityManager,
    private readonly xlsxService: XlsxService,
  ) {}

  async create(group: Group, { email }: AddStudentDto) {
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

      await transaction
        .createQueryBuilder()
        .update(University)
        .set({ count_students: () => 'count_students + 1' })
        .where('id = :id', { id: group.university.id })
        .execute();

      return userToStudent;
    });
  }

  async createOne(
    user: User,
    body: AddStudentDto,
    idGroup: number,
  ): Promise<User> {
    const group = await this.groupRepository.findOneByUser(user, idGroup, true);

    return this.create(group, body);
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
  ) {
    if (groupsId.length !== files.length)
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        `Incorrect list groups or files`,
      );

    const errorRes: {
      [key: number]: Array<{ email?: string; message: string; number: number }>;
    } = {};
    const succsRes: {
      [key: number]: Array<{ email: string; message: string; number: number }>;
    } = {};

    await Promise.all(
      files.map(async (file, index) => {
        const group = await this.groupRepository.findOneByUser(
          user,
          groupsId[index],
          true,
        );

        const curr_sheet = this.xlsxService.readExcel(file);
        await Promise.all(
          curr_sheet.map(async (item, idx) => {
            const { error } = studentOneCreateSchema.validate({
              item,
            });
            if (error) {
              const prev_err = errorRes[index] || [];
              errorRes[index] = [
                ...prev_err,
                {
                  message: error.message,
                  email: item.email,
                  number: idx + 1,
                },
              ];
            } else {
              try {
                const addedUser = await this.create(group, item);
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
          }),
        );

        return curr_sheet;
      }),
    );

    return { data: succsRes, error: errorRes };
  }

  async deleteById(user: User, idStudent: number) {
    const student = await this.studentRepository.findOneByIdAndUser(
      user,
      idStudent,
      true,
    );

    return this.entityManager.transaction(async (transaction) => {
      await transaction.delete(Student, student.id);

      await transaction
        .createQueryBuilder()
        .update(University)
        .set({ count_students: () => 'count_students - 1' })
        .where('id = :id', { id: student.group.university.id })
        .execute();

      return student;
    });
  }

  async changeGroupById(
    user: User,
    idStudent: number,
    body: UpdateGroupStudentDto,
  ) {
    const student = await this.studentRepository.findOneByIdAndUser(
      user,
      idStudent,
    );

    const newGroup = await this.groupRepository.findOneByUser(
      user,
      body.groupId,
    );

    return this.entityManager.transaction(async (transaction) => {
      await transaction.update(Student, student.id, {
        group: newGroup,
      });

      return { ...student, group: newGroup };
    });
  }
}
