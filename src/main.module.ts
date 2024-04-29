import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'process';

import databaseConfig from './database/database.config';
import { ConferenceModule } from './conference/conference.module';
import { WebSocketModule } from './socket/websocket.module';
import { AuthModule } from './controllers/auth/auth.module';
import { UserModule } from './controllers/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRE_REFRESH_TOKEN },
    }),
    AuthModule,
    UserModule,
    WebSocketModule,
    ConferenceModule,
  ],
  providers: [],
})
export class MainModule {}
