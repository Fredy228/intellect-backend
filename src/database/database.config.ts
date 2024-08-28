import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as process from 'process';
import {
  User,
  UserDevices,
  Profile,
  Student,
  Teacher,
  Owner,
  Moderator,
  University,
  Faculty,
  Subject,
  Group,
  SupportMessage,
  Icon,
} from 'lib-intellecta-entity';

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
    SupportMessage,
    Subject,
    Icon,
  ],
  synchronize: !Number(process.env.PRODUCTION), // В режиме разработки можно устанавливать в true, но в продакшене лучше false
  logging: !Number(process.env.PRODUCTION),
};

export default config;
