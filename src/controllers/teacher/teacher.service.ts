import { HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User, Teacher, RoleEnum, University } from 'lib-intellecta-entity';

import { XlsxService } from '../../services/xlsx.service';
import { UniversityRepository } from '../../repository/university.repository';
import { AddTeacherDto, UpdateTeacherDto } from './teacher.dto';
import { CustomException } from '../../services/custom-exception';
import { TeacherRepository } from '../../repository/teacher.repository';
import { teacherOneCreateSchema } from '../../joi-schema/teacher.schema';
import { QueryGetAllType } from '../../types/query.type';
import { generateFilterList } from '../../services/generate-filter-list';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly entityManager: EntityManager,
    private readonly xlsxService: XlsxService,
    private readonly universityRepository: UniversityRepository,
    private readonly teacherRepository: TeacherRepository,
  ) {}

  async create(university: University, { email, job_title }: AddTeacherDto) {
    const userToTeacher = await this.userRepository.findOne({
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
    if (!userToTeacher)
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        `User with email ${email} not found`,
      );

    const existTeacher = await this.teacherRepository.findOne({
      where: {
        user: {
          id: userToTeacher.id,
        },
        university_teacher: {
          id: university.id,
        },
      },
    });
    if (existTeacher)
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        `Such Teacher already exists`,
      );

    return this.entityManager.transaction(async (transaction) => {
      const newTeacher = this.teacherRepository.create({
        title: `Викладач ${university.university_short_name}`,
        job_title,
        role: RoleEnum.TEACHER,
        user: userToTeacher,
        university_teacher: university,
      });

      await transaction.save(newTeacher);

      await transaction
        .createQueryBuilder()
        .update(University)
        .set({ count_teachers: () => 'count_teachers + 1' })
        .where('id = :id', { id: university.id })
        .execute();

      return userToTeacher;
    });
  }

  async createOne(user: User, idUniversity: number, body: AddTeacherDto) {
    const university = await this.universityRepository.findByUser(
      user,
      idUniversity,
    );

    return this.create(university, body);
  }

  async createMany(
    user: User,
    file: Express.Multer.File,
    idUniversity: number,
  ) {
    const university = await this.universityRepository.findByUser(
      user,
      idUniversity,
    );

    const errorRes: Array<{ email?: string; message: string; number: number }> =
      [];
    const succsRes: Array<{ email: string; message: string; number: number }> =
      [];

    const curr_sheet = this.xlsxService.readExcel(file);

    await Promise.all(
      curr_sheet.map(async (item, idx) => {
        const { error } = teacherOneCreateSchema.validate(item);
        if (error) {
          errorRes.push({
            message: error.message,
            email: item.email,
            number: idx + 1,
          });
        } else {
          try {
            const addedUser = await this.create(university, {
              email: item.email,
              job_title: item.job_title,
            });
            succsRes.push({
              message: 'Successfully added',
              email: addedUser.email,
              number: idx + 1,
            });
          } catch (e) {
            errorRes.push({
              message: `${e?.message}`,
              email: item.email,
              number: idx + 1,
            });
          }
        }
      }),
    );

    return { data: succsRes, error: errorRes };
  }

  async getAll(idUniversity: number, query: QueryGetAllType) {
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

    const [teachers, count] = await this.teacherRepository.findAndCount({
      where: {
        university_teacher: {
          id: university.id,
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
      data: teachers,
      total: count,
    };
  }

  async update(user: User, idTeacher: number, body: Partial<UpdateTeacherDto>) {
    const teacher = await this.teacherRepository.findOneByIdAndUser(
      user,
      idTeacher,
    );

    if (!teacher)
      throw new CustomException(
        HttpStatus.NOT_FOUND,
        `Wrong id of Teacher ID ${idTeacher}`,
      );

    await this.teacherRepository.update(teacher.id, body);

    return { ...teacher, ...body };
  }

  async deleteById(user: User, idTeacher: number) {
    const teacher = await this.teacherRepository.findOneByIdAndUser(
      user,
      idTeacher,
    );

    return this.entityManager.transaction(async (transaction) => {
      await transaction.delete(Teacher, teacher.id);

      await transaction
        .createQueryBuilder()
        .update(University)
        .set({ count_teachers: () => 'count_teachers - 1' })
        .where('id = :id', { id: teacher.university_teacher.id })
        .execute();

      return teacher;
    });
  }
}
