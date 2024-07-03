import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserDevices } from '../../entity/user/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { UserUpdateDto } from './user.dto';
import { parsePhoneNumber } from 'libphonenumber-js';
import { CustomException } from '../../services/custom-exception';
import { Profile } from '../../entity/user/proflle.entity';
import { RoleEnum } from '../../enums/user/role-enum';
import { Student } from '../../entity/user/student.entity';
import { Teacher } from '../../entity/user/teacher.entity';
import { Owner } from '../../entity/user/owner.entity';
import { Moderator } from '../../entity/user/admin.entity';

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

  async getUser(user: User): Promise<{
    user: User;
    profiles: Profile[];
  }> {
    // let profile = undefined;

    const profiles = await this.profileRepository.find({
      where: {
        user,
      },
      select: {
        id: true,
        role: true,
        title: true,
      },
    });

    // if (Number(profileId)) {
    //   const currProfile = profiles.find((i) => i.id === profileId);
    //   if (!currProfile)
    //     throw new CustomException(
    //       HttpStatus.NOT_FOUND,
    //       `Not found profile by id: ${profileId}`,
    //     );
    //
    //   const option = {
    //     where: {
    //       id: currProfile.id,
    //     },
    //   };
    //
    //   switch (currProfile.role) {
    //     case RoleEnum.STUDENT:
    //       profile = this.studentRepository.findOne(option);
    //       break;
    //     case RoleEnum.TEACHER:
    //       profile = this.teacherRepository.findOne(option);
    //       break;
    //     case RoleEnum.OWNER_UNIVERSITY:
    //       profile = this.ownerRepository.findOne(option);
    //       break;
    //     case RoleEnum.MODER_UNIVERSITY:
    //       profile = this.moderatorRepository.findOne(option);
    //       break;
    //     default:
    //       throw new CustomException(
    //         HttpStatus.BAD_REQUEST,
    //         `Role: ${currProfile.role} is invalid`,
    //       );
    //   }
    // }

    return { user, profiles };
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
}
