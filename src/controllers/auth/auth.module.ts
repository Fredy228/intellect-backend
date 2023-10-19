import { Module } from '@nestjs/common';
import { UserService } from './auth.service';
import { AuthController } from './auth.controller';
import { Users } from './auth.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [AuthController],
  providers: [UserService],
})
export class AuthModule {}
