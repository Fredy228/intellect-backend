import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import { Users as User } from './auth.entity';
import { LoginAuthDto } from './auth.dto';
import { CustomException } from '../../services/custom-exception';
import { StatusEnum } from '../../enums/error/StatusEnum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async singIn({ email, password }: LoginAuthDto) {
    const user = await this.usersRepository.findOneBy({ email });

    console.log('user', user);
    console.log('password', password);
    console.log('email', email);

    if (!user || user.password !== password)
      throw new CustomException(
        StatusEnum.UNAUTHORIZED,
        `Username або пароль невірний :(`,
      );

    user.password = null;

    const payload = { username: user.firstName, sub: user.id };
    const token = this.jwtService.sign(payload);
    return { user, token };
  }

  // async findAll(): Promise<User | null> {
  //   const query = `
  //     SELECT firstName
  //     FROM Users u
  //       WHERE u.id = 1
  //   `;
  //
  //   const data = await this.usersRepository.query(query);
  //   console.log('data', data);
  //
  //   return data;
  // }
}
