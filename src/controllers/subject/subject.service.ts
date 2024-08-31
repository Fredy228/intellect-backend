import { HttpStatus, Injectable } from '@nestjs/common';
import { SubjectRepository } from '../../repository/subject.repository';
import { UniversityRepository } from '../../repository/university.repository';
import { Subject, User } from 'lib-intellecta-entity';
import { SubjectDto } from './subject.dto';
import { QueryGetAllType } from '../../types/query.type';
import { generateFilterList } from '../../services/generate-filter-list';
import { CustomException } from '../../services/custom-exception';

@Injectable()
export class SubjectService {
  constructor(
    private readonly subjectRepository: SubjectRepository,
    private readonly universityRepository: UniversityRepository,
  ) {}

  async create(
    idUniversity: number,
    body: SubjectDto,
    user: User,
  ): Promise<Subject> {
    const university = await this.universityRepository.findByUser(
      user,
      idUniversity,
    );

    const newSubject = this.subjectRepository.create({
      name: body.name,
      short_name: body.short_name,
      icon_name: body.icon_name,
      university,
    });

    await this.subjectRepository.save(newSubject);

    return newSubject;
  }

  async getById(id: number): Promise<Subject> {
    return this.subjectRepository.findOneByID(id);
  }

  async getAll(idUniversity: number, query: QueryGetAllType) {
    if (!idUniversity)
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        `Wrong id of University ID ${idUniversity}`,
      );

    const options = generateFilterList(query, ['name', 'short_name']);

    const [subjects, total] = await this.subjectRepository.findAndCount({
      where: {
        ...options.filterOption,
        university: {
          id: idUniversity,
        },
      },
      order: options.sortOption,
      ...options.rangeOption,
      select: {
        id: true,
        name: true,
        short_name: true,
        icon_name: true,
      },
    });

    return { data: subjects, total };
  }

  async deleteById(idSubject: number, user: User): Promise<Subject> {
    return this.subjectRepository.deleteByID(idSubject, user);
  }

  async update(idSubject: number, body: Partial<Subject>, user: User) {
    return this.subjectRepository.updateByID(idSubject, user, body);
  }
}
