import { HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import axios, { isAxiosError } from 'axios';
import * as dotenv from 'dotenv';
import * as process from 'process';

import { User } from '../../entity/user/user.entity';
import { Owner } from '../../entity/user/owner.entity';
import { RoleEnum } from '../../enums/user/role-enum';
import {
  ModeratorCreateDto,
  UniversityCreateDto,
  UniversityUpdateDto,
} from './university.dto';
import { CustomException } from '../../services/custom-exception';
import { InjectRepository } from '@nestjs/typeorm';
import { University } from '../../entity/university/university.entity';
import { UniversityRepository } from '../../repository/university.repository';
import { IUniversityEbo } from '../../interface/university-edbo.interface';
import { Moderator } from '../../entity/user/admin.entity';

dotenv.config();

@Injectable()
export class UniversityService {
  constructor(
    private readonly universityRepository: UniversityRepository,
    @InjectRepository(Owner)
    private ownerRepo: Repository<Owner>,
    @InjectRepository(Moderator)
    private moderatorRepo: Repository<Moderator>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly entityManager: EntityManager,
  ) {}

  async updateInfo(
    user: User,
    idUniversity: number,
    body: UniversityUpdateDto,
  ) {
    if (!idUniversity)
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        `Wrong id of University ID ${idUniversity}`,
      );

    const university = await this.universityRepository.findByUser(
      user,
      idUniversity,
    );

    const updateData: UniversityUpdateDto = {};
    Object.keys(body).forEach((key: string) => {
      if (body[key]) updateData[key] = body[key];
    });

    await this.universityRepository.update(university.id, updateData);

    return { ...university, ...updateData };
  }

  async createNewUniversity(
    idUser: number,
    body: UniversityCreateDto,
  ): Promise<University> {
    if (!idUser)
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        `Wrong id of User ID ${idUser}`,
      );
    const user = await this.userRepository.findOne({
      where: {
        id: idUser,
      },
    });

    if (!user)
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        `Not found User ID ${idUser}`,
      );

    return this.entityManager.transaction(async (transaction) => {
      const newOwner = transaction.create(Owner, {
        role: RoleEnum.OWNER_UNIVERSITY,
        title: `Власник ${body.university_short_name}`,
        user,
      });

      await transaction.save(newOwner);

      const newUniversity = transaction.create(University, {
        ...body,
        owner: newOwner,
      });

      await transaction.save(newUniversity);

      return newUniversity;
    });
  }

  async createUniversityEdbo(idUser: number, edbo: number) {
    if (!idUser)
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        `Wrong id of User ID ${idUser}`,
      );
    if (!edbo)
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        `Wrong id of University ID ${edbo}`,
      );

    const user = await this.userRepository.findOne({
      where: {
        id: idUser,
      },
    });

    if (!user)
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        `Not found User ID ${idUser}`,
      );

    const foundUniversity = await this.universityRepository.findOne({
      where: {
        university_id: edbo,
      },
    });

    if (foundUniversity)
      throw new CustomException(
        HttpStatus.CONFLICT,
        `University with ID ${edbo} already exist`,
      );

    const universityFromEdbo = await axios
      .get<IUniversityEbo>(
        `${process.env.EDBO_URL}/api/university/?id=${edbo}&exp=json`,
      )
      .then((res) => res.data)
      .catch((e) => {
        if (isAxiosError(e) && e.status === 404) {
          throw new CustomException(
            HttpStatus.NOT_FOUND,
            `Not found University ID ${edbo} in EDBO`,
          );
        } else {
          throw new CustomException(
            HttpStatus.BAD_REQUEST,
            `Error getting university`,
          );
        }
      });

    return this.entityManager.transaction(async (transaction) => {
      const newOwner = transaction.create(Owner, {
        role: RoleEnum.OWNER_UNIVERSITY,
        title: `Власник ${universityFromEdbo.university_short_name}`,
        user,
      });

      await transaction.save(newOwner);

      const newUniversity = transaction.create(University, {
        university_id: Number(universityFromEdbo.university_id),
        university_parent_id:
          Number(universityFromEdbo.university_parent_id) || null,
        university_name: universityFromEdbo.university_name,
        university_short_name: universityFromEdbo.university_short_name || null,
        post_index_u: universityFromEdbo.post_index_u || null,
        university_site: universityFromEdbo.university_site,
        registration_year: Number(universityFromEdbo.registration_year) || null,
        owner: newOwner,
      });

      await transaction.save(newUniversity);

      return newUniversity;
    });
  }

  async getProfileUni(idUniversity: number): Promise<University> {
    if (!idUniversity)
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        `Wrong id of University ID ${idUniversity}`,
      );

    const university = await this.universityRepository.findOne({
      where: {
        id: idUniversity,
      },
      select: {
        id: true,
        university_name: true,
        university_short_name: true,
        registration_year: true,
        post_index_u: true,
        contacts: true,
        university_site: true,
        count_students: true,
        count_teachers: true,
      },
      relations: {
        faculties: true,
        owner: true,
      },
    });

    if (!university)
      throw new CustomException(HttpStatus.NOT_FOUND, `University not found`);

    return university;
  }

  async createModerator(
    user: User,
    idUniversity: number,
    { email }: ModeratorCreateDto,
  ) {
    if (!idUniversity)
      throw new CustomException(
        HttpStatus.NOT_FOUND,
        `Wrong id of University ID ${idUniversity}`,
      );

    const university = await this.universityRepository.findByUser(
      user,
      idUniversity,
    );

    const userToModerator = await this.userRepository.findOne({
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
    if (!userToModerator)
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        `User with email ${email} not found`,
      );

    return this.entityManager.transaction(async (transaction) => {
      const newModerator = this.moderatorRepo.create({
        user: userToModerator,
        role: RoleEnum.MODER_UNIVERSITY,
        title: `Адмін ${university.university_short_name}`,
        university,
      });

      await transaction.save(newModerator);

      return userToModerator;
    });
  }
}
