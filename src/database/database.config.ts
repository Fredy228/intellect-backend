import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as process from 'process';

import { User, UserDevices } from '../entity/user/user.entity';
import { Profile } from '../entity/user/proflle.entity';
import { University } from '../entity/university/university.entity';
import { Faculty } from '../entity/university/faculty.entity';
import { Group } from '../entity/group/group.entity';
import { Student } from '../entity/user/student.entity';
import { Teacher } from '../entity/user/teacher.entity';
import { Owner } from '../entity/user/owner.entity';
import { Moderator } from '../entity/user/admin.entity';

dotenv.config();

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    User,
    UserDevices,
    Profile,
    Student,
    Teacher,
    Owner,
    Moderator,
    University,
    Faculty,
    Group,
  ],
  synchronize: process.env.PRODUCTION !== 'true', // В режиме разработки можно устанавливать в true, но в продакшене лучше false
  logging: process.env.PRODUCTION !== 'true',
};

export default config;
