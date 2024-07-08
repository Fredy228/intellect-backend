import { HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { University } from '../entity/university/university.entity';
import { Group } from '../entity/group/group.entity';
import { User } from '../entity/user/user.entity';
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
              id: user.id,
            },
          },
        },
        {
          id: idGroup,
          university: {
            moderators: {
              id: user.id,
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
