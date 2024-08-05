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
            id: user.id,
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
