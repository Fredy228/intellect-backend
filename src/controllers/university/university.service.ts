import { HttpStatus, Injectable } from '@nestjs/common';
import { UniversityCreateDto, UniversityUpdateDto } from './university.dto';
import { CustomException } from '../../services/custom-exception';
import { InjectRepository } from '@nestjs/typeorm';
import { University } from '../../entity/university/university.entity';
import { EntityManager, Repository } from 'typeorm';
import { User } from '../../entity/user/user.entity';
import { Owner } from '../../entity/user/owner.entity';
import { RoleEnum } from '../../enums/user/role-enum';
import { UniversityRepository } from '../../repository/university.repository';
import { string } from 'joi';

@Injectable()
export class UniversityService {
  constructor(
    // @InjectRepository(University)
    // private universityRepo: Repository<University>,
    private readonly universityRepository: UniversityRepository,
    @InjectRepository(Owner)
    private ownerRepo: Repository<Owner>,
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
    user: User,
    body: UniversityCreateDto,
  ): Promise<University> {
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
}
