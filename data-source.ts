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
} from 'lib-intellecta-entity';
import { DataSource } from 'typeorm';

dotenv.config();

const AppDataSource = new DataSource({
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
    Subject,
    Faculty,
    Group,
    SupportMessage,
  ],
  // entities: [
  //   __dirname + '/node_modules/lib-intellecta-entity/dist/**/*.entity.js',
  // ],
  synchronize: !Number(process.env.PRODUCTION), // В режиме разработки можно устанавливать в true, но в продакшене лучше false
  logging: !Number(process.env.PRODUCTION),
  cache: false,
  migrationsTableName: 'migrations',
  migrations: [__dirname + '/src/migrations/*{.ts,.js}'],
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

export default AppDataSource;
