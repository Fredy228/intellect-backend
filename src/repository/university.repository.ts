import { DataSource, Repository } from 'typeorm';
import { HttpStatus, Injectable } from '@nestjs/common';
import { University, User } from 'lib-intellecta-entity';

import { CustomException } from '../services/custom-exception';

@Injectable()
export class UniversityRepository extends Repository<University> {
  constructor(private dataSource: DataSource) {
    super(University, dataSource.createEntityManager());
  }

  async findByUser(user: User, idUniversity: number): Promise<University> {
    if (!idUniversity)
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        `Wrong id of University ID ${idUniversity}`,
      );

    const university = await this.findOne({
      where: [
        {
          id: idUniversity,
          moderators: {
            user: {
              id: user.id,
            },
          },
        },
        {
          id: idUniversity,
          owner: {
            user: {
              id: user.id,
            },
          },
        },
      ],
    });

    if (!university)
      throw new CustomException(
        HttpStatus.NOT_FOUND,
        `Not found our university`,
      );
    return university;
  }
}
