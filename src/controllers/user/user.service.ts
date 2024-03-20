import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserDevices } from '../../entity/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { UserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserDevices)
    private devicesRepository: Repository<UserDevices>,
    private readonly entityManager: EntityManager,
  ) {}

  async getUser(user: User): Promise<User> {
    user.password = undefined;

    return user;
  }

  async updateUserPersonalInfo(
    user: User,
    body: Partial<UserDto>,
  ): Promise<void> {
    const keysBody = Object.keys(body);

    if (keysBody.length === 0) return;

    await this.usersRepository.update(user, body);

    return;
  }
}
