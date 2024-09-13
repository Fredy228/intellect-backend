import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { parsePhoneNumber } from 'libphonenumber-js';
import * as dotenv from 'dotenv';
import * as process from 'process';
import {
  Moderator,
  Owner,
  Profile,
  RoleEnum,
  Student,
  Teacher,
  User,
  UserDevices,
} from 'lib-intellecta-entity';

import { UserUpdateDto } from './user.dto';
import { CustomException } from '../../services/custom-exception';

dotenv.config();

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
    @InjectRepository(Owner)
    private ownerRepository: Repository<Owner>,
    @InjectRepository(Moderator)
    private moderatorRepository: Repository<Moderator>,
    @InjectRepository(UserDevices)
    private devicesRepository: Repository<UserDevices>,
    private readonly entityManager: EntityManager,
  ) {}

  async getUser(user: User): Promise<User> {
    const profiles = user.profiles;

    user.profiles = await Promise.all(
      profiles.map(async (item) => {
        switch (item.role) {
          case RoleEnum.OWNER_UNIVERSITY:
            return await this.ownerRepository.findOne({
              where: {
                id: item.id,
              },
              relations: {
                university: true,
              },
              select: {
                university: {
                  id: true,
                  university_name: true,
                  university_short_name: true,
                },
              },
            });
          case RoleEnum.MODER_UNIVERSITY:
            return await this.moderatorRepository.findOne({
              where: {
                id: item.id,
              },
              relations: {
                university: true,
              },
              select: {
                university: {
                  id: true,
                  university_name: true,
                  university_short_name: true,
                },
              },
            });
          default:
            return item;
        }
      }),
    );

    return user;
  }

  async updateUserPersonalInfo(user: User, body: UserUpdateDto): Promise<void> {
    const keysBody = Object.keys(body);
    if (keysBody.length === 0) return;

    let phone = undefined;
    if (body.phone) {
      let phoneNumber = null;
      try {
        phoneNumber = parsePhoneNumber(body.phone.number, body.phone.country);
      } catch (e) {
        throw new CustomException(
          HttpStatus.BAD_REQUEST,
          `numberPhone|The number phone is invalid`,
        );
      }

      if (!phoneNumber?.isValid())
        throw new CustomException(
          HttpStatus.BAD_REQUEST,
          `numberPhone|The number phone is invalid`,
        );

      phone = {
        country: body.phone.country,
        number: body.phone.number,
      };
    } else if (body.phone === null) {
      phone = null;
    }

    await this.usersRepository.update(user.id, {
      ...body,
      phone,
    });

    return;
  }

  async getMyUserProfile(user: User) {
    const foundProfile = await this.usersRepository.findOne({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        middleName: true,
        bio: true,
        birthday: true,
        phone: {},
        email: true,
        sex: true,
      },
    });

    if (!foundProfile)
      throw new CustomException(HttpStatus.NOT_FOUND, 'User not found');

    return foundProfile;
  }

  async createMaker(user: User) {
    const is_allow = process.env.MAKER_CREATE_ALLOW;
    if (!is_allow || !Number(is_allow))
      throw new CustomException(HttpStatus.METHOD_NOT_ALLOWED, 'Not allow');

    const newProfile = this.profileRepository.create({
      user,
      role: RoleEnum.MAKER,
      title: 'Dev',
    });

    await this.profileRepository.save(newProfile);

    return newProfile;
  }
}
