import { HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Group, User } from 'lib-intellecta-entity';

import { CustomException } from '../services/custom-exception';

@Injectable()
export class GroupRepository extends Repository<Group> {
  constructor(private dataSource: DataSource) {
    super(Group, dataSource.createEntityManager());
  }

  async findOneByUser(
    user: User,
    idGroup: number,
    isWithUni?: boolean,
  ): Promise<Group> {
    const relations = isWithUni ? { university: true } : {};

    const group = await this.findOne({
      where: [
        {
          id: idGroup,
          university: {
            owner: {
              user: {
                id: user.id,
              },
            },
          },
        },
        {
          id: idGroup,
          university: {
            moderators: {
              user: {
                id: user.id,
              },
            },
          },
        },
      ],
      relations: { ...relations },
    });

    if (!group)
      throw new CustomException(HttpStatus.NOT_FOUND, `Not found our group`);

    return group;
  }
}
