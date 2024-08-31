import { HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RoleEnum, Subject, User } from 'lib-intellecta-entity';
import { CustomException } from '../services/custom-exception';
import { SubjectDto } from '../controllers/subject/subject.dto';

@Injectable()
export class SubjectRepository extends Repository<Subject> {
  constructor(private dataSource: DataSource) {
    super(Subject, dataSource.createEntityManager());
  }

  async findOneByID(id: number) {
    if (!id)
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        `Wrong id of Subject ID ${id}`,
      );

    const subject = await this.findOne({
      where: {
        id,
      },
    });

    if (!subject)
      throw new CustomException(
        HttpStatus.NOT_FOUND,
        `Not found Subject ID ${id}`,
      );

    return subject;
  }

  async deleteByID(idSubject: number, user: User) {
    if (!idSubject)
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        `Wrong id of Subject ID ${idSubject}`,
      );

    if (user.profiles.find((i) => i.role === RoleEnum.MAKER)) {
      const subject = await this.findOneByID(idSubject);

      await this.delete(subject.id);

      return subject;
    } else {
      const subject = await this.findOne({
        where: [
          {
            id: idSubject,
            university: {
              owner: {
                user: {
                  id: user.id,
                },
              },
            },
          },
          {
            id: idSubject,
            university: {
              moderators: {
                user: {
                  id: user.id,
                },
              },
            },
          },
        ],
      });

      if (!subject)
        throw new CustomException(
          HttpStatus.NOT_FOUND,
          `Not found Subject ID ${idSubject} in your university`,
        );

      await this.delete(subject.id);

      return subject;
    }
  }

  async updateByID(idSubject: number, user: User, body: Partial<SubjectDto>) {
    if (!idSubject)
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        `Wrong id of Subject ID ${idSubject}`,
      );

    let subject: Subject | null = null;

    if (user.profiles.find((i) => i.role === RoleEnum.MAKER)) {
      subject = await this.findOneByID(idSubject);
    } else {
      subject = await this.findOne({
        where: [
          {
            id: idSubject,
            university: {
              owner: {
                user: {
                  id: user.id,
                },
              },
            },
          },
          {
            id: idSubject,
            university: {
              moderators: {
                user: {
                  id: user.id,
                },
              },
            },
          },
        ],
      });
    }

    if (!subject)
      throw new CustomException(
        HttpStatus.NOT_FOUND,
        `Not found Subject ID ${idSubject} in your university`,
      );

    await this.update(subject.id, body);

    return { ...subject, ...body };
  }
}
