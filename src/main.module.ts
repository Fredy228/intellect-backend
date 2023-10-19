import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'process';

import databaseConfig from './database/database.config';
import { ConferenceModule } from './controllers/conference/conference.module';
import { WebSocketModule } from './socket/websocket.module';
import { AuthModule } from './controllers/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    AuthModule,
    WebSocketModule,
    ConferenceModule,
  ],
  providers: [],
})
export class MainModule {}
