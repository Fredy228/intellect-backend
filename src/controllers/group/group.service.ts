import { HttpStatus, Injectable } from '@nestjs/common';
import { type Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Group, User } from 'lib-intellecta-entity';

import { GroupDto } from './group.dto';
import { CustomException } from '../../services/custom-exception';
import { UniversityRepository } from '../../repository/university.repository';
import { QueryGetAllType } from '../../types/query.type';
import { generateFilterList } from '../../services/generate-filter-list';
import { GroupRepository } from '../../repository/group.repository';

@Injectable()
export class GroupService {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly universityRepository: UniversityRepository,
  ) {}

  async create(
    user: User,
    body: GroupDto,
    idUniversity: number,
  ): Promise<Group> {
    const foundUniversity = await this.universityRepository.findByUser(
      user,
      idUniversity,
    );

    const newGroup = this.groupRepository.create({
      university: foundUniversity,
      ...body,
    });

    await this.groupRepository.save(newGroup);

    return newGroup;
  }

  async getAll(user: User, idUniversity: number, query: QueryGetAllType) {
    if (!idUniversity)
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        `Wrong id of University ID ${idUniversity}`,
      );

    const options = generateFilterList(query, ['name']);

    const [groups, total] = await this.groupRepository.findAndCount({
      where: [
        {
          ...options.filterOption,
          university: {
            id: idUniversity,
            moderators: {
              user: {
                id: user.id,
              },
            },
          },
        },
        {
          ...options.filterOption,
          university: {
            id: idUniversity,
            owner: {
              user: {
                id: user.id,
              },
            },
          },
        },
      ],
      order: options.sortOption,
      ...options.rangeOption,
      select: {
        id: true,
        name: true,
        level: true,
        start_date: true,
        end_date: true,
      },
    });

    return { data: groups, total };
  }

  async getById(idGroup: number): Promise<Group> {
    if (!idGroup)
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        `Wrong id of Group ID ${idGroup}`,
      );

    const group = await this.groupRepository.findOne({
      where: {
        id: idGroup,
      },
    });
    if (!group)
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        `Not found Group ID ${idGroup}`,
      );

    return group;
  }

  async delete(user: User, idGroup: number): Promise<Group> {
    const group = await this.groupRepository.findOneByUser(user, idGroup);

    await this.groupRepository.delete(group.id);

    return group;
  }

  async update(
    user: User,
    idGroup: number,
    body: Partial<GroupDto> = {},
  ): Promise<Group> {
    const group = await this.groupRepository.findOneByUser(user, idGroup);

    Object.keys(body).forEach((key: string) => {
      if (body[key]) group[key] = body[key];
    });

    await this.groupRepository.save(group);

    return group;
  }
}
