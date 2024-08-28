import { HttpStatus, Injectable } from '@nestjs/common';
import { type Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Group, User } from 'lib-intellecta-entity';

import { GroupDto } from './group.dto';
import { CustomException } from '../../services/custom-exception';
import { UniversityRepository } from '../../repository/university.repository';
import { QueryGetAllType } from '../../types/query.type';
import { generateFilterList } from '../../services/generate-filter-list';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group) private groupRepository: Repository<Group>,
    private readonly universityRepository: UniversityRepository,
  ) {}

  async create(
    user: User,
    body: GroupDto,
    idUniversity: number,
  ): Promise<Group> {
    if (!idUniversity)
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        `Wrong id of University ID ${idUniversity}`,
      );

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

    console.log('options', options);

    const [groups, count] = await this.groupRepository.findAndCount({
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

    if (!groups) return [];

    return { data: groups, count };
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
    if (!idGroup)
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        `Wrong id of Group ID ${idGroup}`,
      );

    const group = await this.groupRepository.findOne({
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
      select: {
        id: true,
        name: true,
        level: true,
      },
    });

    if (!group)
      throw new CustomException(HttpStatus.BAD_REQUEST, `Not found our Group`);

    await this.groupRepository.delete(group.id);

    return group;
  }

  async update(
    user: User,
    idGroup: number,
    body: Partial<GroupDto> = {},
  ): Promise<Group> {
    const group = await this.getById(idGroup);

    Object.keys(body).forEach((key: string) => {
      if (body[key]) group[key] = body[key];
    });

    await this.groupRepository.save(group);

    return group;
  }
}
